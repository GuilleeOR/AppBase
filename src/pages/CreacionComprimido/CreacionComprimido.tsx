import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

function CreacionComprimido() {
  const [password, setPassword] = useState<string>('');
  const [zipFileName, setZipFileName] = useState<string>('archivo.zip');
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const fileUploadRef = useRef<FileUpload>(null);
  const toastRef = useRef<Toast>(null);

  const handleFileUpload = (event: { files: File[] }) => {
    const uploadedFiles = event.files;
    setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
    
    if (toastRef.current) {
      toastRef.current.show({
        severity: 'info',
        summary: 'Archivos agregados',
        detail: `${uploadedFiles.length} archivo(s) agregado(s) para comprimir`,
        life: 3000
      });
    }
    
    // Limpiar el componente FileUpload
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const createZipFile = async () => {
    if (files.length === 0) {
      if (toastRef.current) {
        toastRef.current.show({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'No hay archivos para comprimir',
          life: 3000
        });
      }
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(0);
      
       // Importamos dinámicamente zip.js
       const { BlobWriter, BlobReader, ZipWriter } = await import('@zip.js/zip.js');
      
      // Configuración de encriptación (si hay contraseña)
      const encryptionStrength = 3 as const; // Aseguramos que TypeScript lo trate como un literal
      const options = password ? {
        password,
        encryptionStrength // AES-256
      } : undefined;
      
      // Crear el archivo zip
      const zipWriter = new ZipWriter(new BlobWriter(), { bufferedWrite: true });
      
      // Agregar cada archivo al zip
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new BlobReader(file);
        
        // Agregar archivo al zip con encriptación si hay contraseña
        await zipWriter.add(file.name, reader, options);
        
        // Actualizar progreso
        const currentProgress = Math.round(((i + 1) / files.length) * 100);
        setProgress(currentProgress);
      }
      
      // Finalizar y obtener el blob del zip
      const zipBlob = await zipWriter.close();
      
      // Crear un enlace para descargar el archivo
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(zipBlob);
      downloadLink.download = zipFileName;
      downloadLink.click();
      
      // Limpiar
      URL.revokeObjectURL(downloadLink.href);
      
      if (toastRef.current) {
        toastRef.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Archivo comprimido creado correctamente',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error al crear el archivo comprimido:', error);
      if (toastRef.current) {
        toastRef.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al crear el archivo comprimido',
          life: 3000
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="creacion-comprimido-container">
      <Toast ref={toastRef} />
      
      <Card title="Creación de Archivos Comprimidos" className="mb-4">
        <div className="p-fluid">
          <div className="field mb-4">
            <label htmlFor="password" className="font-bold block mb-2">Contraseña (opcional)</label>
            <InputText
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese una contraseña para proteger el archivo"
            />
            <small className="text-muted">Deje en blanco si no desea proteger el archivo con contraseña</small>
          </div>
          
          <div className="field mb-4">
            <label htmlFor="zipFileName" className="font-bold block mb-2">Nombre del archivo ZIP</label>
            <InputText
              id="zipFileName"
              value={zipFileName}
              onChange={(e) => setZipFileName(e.target.value)}
              placeholder="Nombre del archivo ZIP"
            />
          </div>
          
          <Divider align="left">
            <div className="inline-flex align-items-center">
              <span className="font-bold">Agregar archivos</span>
            </div>
          </Divider>
          
          <div className="field mb-4">
            <FileUpload
              chooseLabel='Seleccionar Archivos'
              ref={fileUploadRef}
              multiple
              customUpload
              auto
              uploadHandler={handleFileUpload}
              emptyTemplate={<p className="m-0">Arrastre y suelte archivos aquí para agregarlos al comprimido.</p>}
            />
          </div>
          
          {files.length > 0 && (
            <div className="field mb-4">
              <label className="font-bold block mb-2">Archivos a comprimir ({files.length})</label>
              <ul className="list-none p-0 m-0">
                {files.map((file, index) => (
                  <li key={index} className="flex align-items-center p-2 border-bottom-1 surface-border">
                    <span className="flex-grow-1">{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                    <Button
                      icon="pi pi-times"
                      rounded
                      text
                      severity="danger"
                      onClick={() => removeFile(index)}
                      tooltip="Eliminar"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {isProcessing && (
            <div className="field mb-4">
              <label className="font-bold block mb-2">Progreso</label>
              <ProgressBar value={progress} showValue />
            </div>
          )}
          
          <div className="flex justify-content-end">
            <Button
              label="Crear archivo comprimido"
              icon="pi pi-file-export"
              onClick={createZipFile}
              disabled={isProcessing || files.length === 0}
              loading={isProcessing}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CreacionComprimido;
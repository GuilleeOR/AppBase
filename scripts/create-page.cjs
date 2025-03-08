#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Obtener el nombre de la página desde los argumentos de línea de comandos
const pageName = process.argv[2];

if (!pageName) {
  console.error('Por favor, proporciona un nombre para la página.');
  console.error('Uso: npm run create-page NombrePagina');
  process.exit(1);
}

// Capitalizar primera letra para el nombre del componente
const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

// Rutas
const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const newPageDir = path.join(pagesDir, componentName);
const routerFile = path.join(__dirname, '..', 'src', 'router.tsx');

// Crear estructura de directorios
console.log(`Creando estructura para la página ${componentName}...`);

// Crear directorio principal de la página
fs.mkdirSync(newPageDir, { recursive: true });

// Crear subdirectorios
fs.mkdirSync(path.join(newPageDir, 'components'), { recursive: true });
fs.mkdirSync(path.join(newPageDir, 'hooks'), { recursive: true });
fs.mkdirSync(path.join(newPageDir, 'services'), { recursive: true });

// Crear archivo principal del componente
const componentContent = `function ${componentName}() {
  return (
    <div>
      <h1>${componentName}</h1>
      <p>Esta es la página de ${componentName}</p>
    </div>
  )
}

export default ${componentName}
`;

fs.writeFileSync(path.join(newPageDir, `${componentName}.tsx`), componentContent);

// Actualizar el router.tsx
console.log('Actualizando el router...');

// Leer el contenido actual del router
let routerContent = fs.readFileSync(routerFile, 'utf8');

// Añadir la importación
const importStatement = `import ${componentName} from "./pages/${componentName}/${componentName}";`;
routerContent = routerContent.replace(
  /import ErrorPage from "\.\/pages\/ErrorPage\/ErrorPage";/,
  `import ErrorPage from "./pages/ErrorPage/ErrorPage";\n${importStatement}`
);

// Añadir la ruta
const routeDefinition = `      {
        path: '${pageName.toLowerCase()}',
        element: <${componentName} />,
      },`;

// Encontrar dónde insertar la nueva ruta (antes del último corchete de children)
const childrenClosingIndex = routerContent.lastIndexOf('    ],');
if (childrenClosingIndex !== -1) {
  routerContent = 
    routerContent.slice(0, childrenClosingIndex) + 
    routeDefinition + '\n' + 
    routerContent.slice(childrenClosingIndex);
}

// Guardar los cambios
fs.writeFileSync(routerFile, routerContent);

console.log(`¡Página ${componentName} creada exitosamente!`);
console.log(`- Componente: src/pages/${componentName}/${componentName}.tsx`);
console.log(`- Ruta: /${pageName.toLowerCase()}`);
console.log('No olvides añadir un enlace en el menú de navegación si es necesario.');

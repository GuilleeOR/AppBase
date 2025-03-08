#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Obtener el nombre del módulo desde los argumentos de línea de comandos
const moduleName = process.argv[2];

if (!moduleName) {
  console.error('Por favor, proporciona un nombre para el módulo.');
  console.error('Uso: npm run create-module NombreModulo');
  process.exit(1);
}

// Capitalizar primera letra para el nombre del componente
const componentName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

// Rutas
const modulesDir = path.join(__dirname, '..', 'src', 'modules');
const newModuleDir = path.join(modulesDir, componentName);
const routerFile = path.join(__dirname, '..', 'src', 'router.tsx');

// Crear estructura de directorios
console.log(`Creando estructura para el módulo ${componentName}...`);

// Crear directorio principal del módulo
fs.mkdirSync(newModuleDir, { recursive: true });

// Crear subdirectorios principales
fs.mkdirSync(path.join(newModuleDir, 'components'), { recursive: true });
fs.mkdirSync(path.join(newModuleDir, 'hooks'), { recursive: true });
fs.mkdirSync(path.join(newModuleDir, 'services'), { recursive: true });
fs.mkdirSync(path.join(newModuleDir, 'pages'), { recursive: true });

// Crear archivo de rutas del módulo
const routesContent = `import { RouteObject } from "react-router-dom";
import ${componentName} from "./${componentName}";

// Importa aquí las páginas del módulo
// import SomePage from "./pages/SomePage/SomePage";

export const ${moduleName}Routes: RouteObject[] = [
  {
    path: '${moduleName.toLowerCase()}',
    element: <${componentName} />,
    children: [
      // Añade aquí las rutas hijas del módulo
      // {
      //   path: 'some-page',
      //   element: <SomePage />,
      // },
    ],
  },
];
`;

fs.writeFileSync(path.join(newModuleDir, `routes.tsx`), routesContent);

// Crear archivo principal del módulo (punto de entrada)
const moduleContent = `import { Outlet } from "react-router-dom";

function ${componentName}() {
  return (
    <div className="${moduleName.toLowerCase()}-module">
      <h1>${componentName} Module</h1>
      {/* El Outlet renderizará las rutas hijas */}
      <Outlet />
    </div>
  )
}

export default ${componentName}
`;

fs.writeFileSync(path.join(newModuleDir, `${componentName}.tsx`), moduleContent);

// Crear una página de ejemplo
const examplePageDir = path.join(newModuleDir, 'pages', 'Home');
fs.mkdirSync(examplePageDir, { recursive: true });
fs.mkdirSync(path.join(examplePageDir, 'components'), { recursive: true });

const examplePageContent = `function Home() {
  return (
    <div>
      <h2>${componentName} Home Page</h2>
      <p>Esta es la página principal del módulo ${componentName}</p>
    </div>
  )
}

export default Home
`;

fs.writeFileSync(path.join(examplePageDir, `Home.tsx`), examplePageContent);

// Actualizar el archivo de rutas del módulo para incluir la página de ejemplo
const updatedRoutesContent = `import { RouteObject } from "react-router-dom";
import ${componentName} from "./${componentName}";

// Importa aquí las páginas del módulo
import Home from "./pages/Home/Home";

export const ${moduleName}Routes: RouteObject[] = [
  {
    path: '${moduleName.toLowerCase()}',
    element: <${componentName} />,
    children: [
      // Añade aquí las rutas hijas del módulo
      {
        index: true,
        element: <Home />,
      },
    ],
  },
];
`;

fs.writeFileSync(path.join(newModuleDir, `routes.tsx`), updatedRoutesContent);

// Actualizar el router.tsx principal
console.log('Actualizando el router principal...');

// Leer el contenido actual del router
let routerContent = fs.readFileSync(routerFile, 'utf8');

// Añadir la importación de las rutas del módulo
const importStatement = `import { ${moduleName}Routes } from "./modules/${componentName}/routes";`;

// Buscar la última importación
const lastImportIndex = routerContent.lastIndexOf('import');
const lastImportEndIndex = routerContent.indexOf('\n', lastImportIndex);

if (lastImportEndIndex !== -1) {
  routerContent = 
    routerContent.slice(0, lastImportEndIndex + 1) + 
    importStatement + '\n' + 
    routerContent.slice(lastImportEndIndex + 1);
}

// Añadir las rutas del módulo al array de rutas
// Buscar el array de children
const childrenStartIndex = routerContent.indexOf('children: [');
const childrenArrayStartIndex = childrenStartIndex + 'children: ['.length;

// Encontrar dónde insertar las nuevas rutas (después del último elemento del array)
const spreadOperatorStatement = `      // Rutas del módulo ${componentName}
      ...${moduleName}Routes[0]?.children?.map(route => ({
        ...route,
        path: \`\${${moduleName}Routes[0]?.path}/\${route.path || ''}\`.replace(/\\/+$/, ''),
      })) || [],`;

if (childrenArrayStartIndex !== -1) {
  routerContent = 
    routerContent.slice(0, childrenArrayStartIndex) + 
    '\n' + spreadOperatorStatement + 
    routerContent.slice(childrenArrayStartIndex);
}

// Guardar los cambios
fs.writeFileSync(routerFile, routerContent);

// Crear un archivo index.ts para exportar todo lo necesario del módulo
const indexContent = `// Punto de entrada del módulo ${componentName}
export { default as ${componentName} } from './${componentName}';
export { ${moduleName}Routes } from './routes';
`;

fs.writeFileSync(path.join(newModuleDir, 'index.ts'), indexContent);

console.log(`¡Módulo ${componentName} creado exitosamente!`);
console.log(`- Módulo: src/modules/${componentName}/`);
console.log(`- Punto de entrada: src/modules/${componentName}/${componentName}.tsx`);
console.log(`- Rutas: src/modules/${componentName}/routes.tsx`);
console.log(`- Página de ejemplo: src/modules/${componentName}/pages/Home/Home.tsx`);
console.log(`- Ruta principal: /${moduleName.toLowerCase()}`);
console.log(`- Ruta de la página de ejemplo: /${moduleName.toLowerCase()}/`);
console.log('\nPara añadir nuevas páginas al módulo:');
console.log(`1. Crea la página en src/modules/${componentName}/pages/`);
console.log(`2. Importa y añade la ruta en src/modules/${componentName}/routes.tsx`);

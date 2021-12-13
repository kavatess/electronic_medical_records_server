export function exportConstant(name: string, values: string[]) {
  return `export const ${name} = ${JSON.stringify(values)};\n`
    + `//export_constant//`;
}

export function importConstant(name: string, module: string) {
  return `import { ${name} } from '../${module}.module';\n`
    + `//import_constant//`;
}

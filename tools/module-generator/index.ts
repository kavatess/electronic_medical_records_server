import modules, { APP_NAME } from "./config";
import fs from "fs";
import { createSchemaProperty } from "./lib/createSchemaProperty";
import { addDto } from "./lib/createDtoProperty";
import { features } from "./lib/feature.config";
import { addKhe } from "./lib/addKhe";
import { exportConstant, importConstant } from "./lib/addConstant";
import { addArrayUpdateDto } from "./lib/addUpdateArray";
import { toStartCase, forceOnlyStartCase } from './lib/toStartCase';
import { searchEnumProperties } from './lib/searchEnumProperties';
import { createChildSchema, generateChildSchemaImport } from './lib/createChildSchema';
import { createChildDto, generateChildDtoImport } from "./lib/createChildDto";
/*
TODO:
- dbml
- fix subscriber config
*/
function main() {
  // loop through modules requested
  for (const module of modules) {
    // prepare destination folder
    const outputDir = module.output;
    const moduleName = module.name.split("-").join("");
    const ModuleName = module.name.split("-").map(str => forceOnlyStartCase(str)).join("");

    fs.mkdirSync(outputDir, { recursive: true });

    const generatedFilePaths = [];
    features.forEach(({ name, files }) => {
      if (module[name] || name == "module") {
        files.forEach(file => {
          // write file to destination folder
          const fileContent = fs.readFileSync(`${__dirname}/template/${file}`, "utf8");
          file = file.replace(/employee/g, module.name);
          const filePath = `${__dirname}/../../${outputDir}/${file}`;
          const dir = filePath.split("/").slice(0, -1).join("/");
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(filePath, fileContent);
          generatedFilePaths.push({ feature: name, filePath, dir });
        });
      }
    });

    // loop through generated files
    generatedFilePaths.forEach(({ feature, filePath, dir }) => {
      let fileContent = fs.readFileSync(filePath, "utf8");

      // replace module name
      fileContent = fileContent.replace(/(.*)(employee)(\..*)/g, `$1${module.name}$3`); // file
      fileContent = fileContent.replace(/employee/g, moduleName); // name
      fileContent = fileContent.replace(/Employee/g, ModuleName); // uppercase name

      // replace app name
      fileContent = fileContent.replace(/case/g, APP_NAME);

      // insert schema fields
      if (feature == "schema") {
        // loop through properties to add schema
        module.properties.forEach(property => {
          fileContent = fileContent.replace("//Prop", createSchemaProperty(property));

          if (property.type == "object" && property.properties) {
            const schemaName = toStartCase(property.name);
            fileContent = fileContent.replace("//import_child_schema//",
              generateChildSchemaImport(schemaName, property.name)
            );
            createChildSchema(property, dir, module.name);
          }
        });
      }

      // insert dto properties
      else if (feature == "dto" && filePath.includes('array-update')) {
        module.properties.forEach(property => {
          if (property.isArray)
            fileContent = fileContent.replace('//Prop', `${addArrayUpdateDto(property)}`);
        });
      }

      else if (feature == "dto") {
        // loop through properties to add dto properties
        module.properties.forEach((property) => {
          fileContent = fileContent.replace('//Prop', `${addDto(property)}`);

          if (property.type == "object" && property.properties) {
            const dtoName = toStartCase(property.name);
            fileContent = fileContent.replace("//import_child_dto//",
              generateChildDtoImport(dtoName, property.name)
            );
            createChildDto(property, dir, module.name);
          }
        });
      }

      // insert khe schema
      else if (feature == "controller") {
        fileContent = fileContent.replace(/(@ApiTag.*)(employee)(.*)/g, `$1${module.name}$3`);
        fileContent = fileContent.replace(/(@Controller.*)(employee)(.*)/g, `$1${module.name}$3`);
        fileContent = fileContent.replace(/\/\/KheSchema\/\//, addKhe(module));
      }

      else if (feature == 'module') {
        // uncomment used import, variables
        for (const key in module) {
          if (module[key]) {
            const regexUncomment = new RegExp(`//${key}//`, "g");
            fileContent = fileContent.replace(regexUncomment, "");
          }
        }

        // export constants for schemas, dtos
        module.properties
          .map((property) => searchEnumProperties(property))
          .reduce((a, b) => a.concat(b))
          .forEach((property) => {
            fileContent = fileContent.replace(/\/\/export_constant\/\//, exportConstant(`${property.name.toUpperCase()}_ENUM`, property.enum));
          });
      }

      if (fileContent.includes('//import_constant')) {
        // import constants
        module.properties
          .filter(property => property.enum && property.enum.length)
          .forEach(property => {
            fileContent = fileContent.replace(/\/\/import_constant\/\//, importConstant(`${property.name.toUpperCase()}_ENUM`, module.name));
          });
      }

      // cleanup comments
      fileContent = fileContent.replace(/\/\/.*/g, "");
      fs.writeFileSync(filePath, fileContent);
    });
  }
}

main();

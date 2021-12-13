import { IProperty } from '../config.interface';
import { readFileSync, writeFileSync } from 'fs';
import { toStartCase } from './toStartCase';
import { createSchemaProperty } from './createSchemaProperty';
import { importConstant } from './addConstant';

export function generateChildSchemaImport(schemaName: string, fileName: string) {
    return `import { ${schemaName}, ${schemaName}Schema } from './${fileName}.schema';\n`
        + "//import_child_schema//";
}

const childSchemaModel = readFileSync(`${__dirname}/../template/schemas/child.schema.ts`, 'utf-8');
export function createChildSchema(objectProperty: IProperty, directory: string, moduleName: string, parentProperty: IProperty = null) {
    const schemaName = parentProperty
        ? toStartCase(parentProperty.name) + toStartCase(objectProperty.name)
        : toStartCase(objectProperty.name);
    const fileName = parentProperty
        ? parentProperty.name.toLowerCase() + '-' + objectProperty.name.toLowerCase()
        : objectProperty.name.toLowerCase();

    let schemaModel = childSchemaModel;
    schemaModel = schemaModel.replace(/Child/g, schemaName);

    // create schema
    objectProperty.properties.forEach(childProp => {
        if (childProp.type == "object" && childProp.properties) {
            // create nested schemas by recursion
            const { childSchemaName, childFileName } = createChildSchema(childProp, directory, moduleName, objectProperty);
            // After recursion, import nested schemas and create schema properties
            schemaModel = schemaModel.replace("//import_child_schema//",
                generateChildSchemaImport(childSchemaName, childFileName)
            );
            schemaModel = schemaModel.replace('//Prop', createSchemaProperty(childProp, childSchemaName));
        }
        else {
            schemaModel = schemaModel.replace('//Prop', createSchemaProperty(childProp));
        }
    });

    // Import related constants
    if (schemaModel.search(/\/\/import_constant\/\//)) {
        objectProperty.properties
            .filter(property => property.enum && property.enum.length)
            .forEach(property => {
                schemaModel = schemaModel.replace(/\/\/import_constant\/\//, importConstant(`${property.name.toUpperCase()}_ENUM`, moduleName));
            });
    }

    // cleanup comments
    schemaModel = schemaModel.replace(/\/\/.*/g, "");
    writeFileSync(`${directory}/${fileName}.schema.ts`, schemaModel);
    return {
        childSchemaName: schemaName,
        childFileName: fileName
    }
}

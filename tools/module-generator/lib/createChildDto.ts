import { IProperty } from '../config.interface';
import { readFileSync, writeFileSync } from 'fs';
import { toStartCase } from './toStartCase';
import { addDto } from './createDtoProperty';
import { importConstant } from './addConstant';

export function generateChildDtoImport(dtoName: string, fileName: string) {
    return `import { ${dtoName}Dto } from './${fileName}.dto';\n`
        + "//import_child_dto//";
}

const childDtoModel = readFileSync(`${__dirname}/../template/dto/child.dto.ts`, 'utf-8');
export function createChildDto(objectProperty: IProperty, directory: string, moduleName: string, parentProperty: IProperty = null) {
    const dtoName = parentProperty
        ? toStartCase(parentProperty.name) + toStartCase(objectProperty.name)
        : toStartCase(objectProperty.name);
    const fileName = parentProperty
        ? parentProperty.name.toLowerCase() + '-' + objectProperty.name.toLowerCase()
        : objectProperty.name.toLowerCase();

    let dtoModel = childDtoModel;
    dtoModel = dtoModel.replace(/Child/g, dtoName);

    // create dto
    objectProperty.properties.forEach(childProp => {
        if (childProp.type == "object" && childProp.properties) {
            // create nested dtos by recursion
            const { childDtoName, childFileName } = createChildDto(childProp, directory, moduleName, objectProperty);
            // After recursion, import nested dtos and create dto properties
            dtoModel = dtoModel.replace("//import_child_dto//",
                generateChildDtoImport(childDtoName, childFileName)
            );
            dtoModel = dtoModel.replace('//Prop', addDto(childProp, childDtoName));
        }
        else {
            dtoModel = dtoModel.replace('//Prop', addDto(childProp));
        }
    });

    // Import related constants
    if (dtoModel.search('//import_constant//')) {
        objectProperty.properties
            .filter(property => property.enum && property.enum.length)
            .forEach(property => {
                dtoModel = dtoModel.replace('//import_constant//', importConstant(`${property.name.toUpperCase()}_ENUM`, moduleName));
            });
    }

    // cleanup comments
    dtoModel = dtoModel.replace(/\/\/.*/g, "");
    writeFileSync(`${directory}/${fileName}.dto.ts`, dtoModel);
    return {
        childDtoName: dtoName,
        childFileName: fileName
    }
}

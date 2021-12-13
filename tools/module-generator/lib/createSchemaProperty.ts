import { IProperty } from "../config.interface";
import { toStartCase } from './toStartCase';

export function createSchemaProperty(property: IProperty, childSchema?: string) {
  let propType = '';
  const optionArr = [];
  if (property.type === 'object') {
    propType = childSchema ? childSchema : toStartCase(property.name);
    optionArr.push(property.isArray ? `type: [${propType}Schema]` : `type: ${propType}Schema`);
  }
  else if (property.type === 'mongoId') {
    propType = 'string';
    if (property.isArray) {
      optionArr.push(`type: [{ type: Types.ObjectId, ref: "${property.ref}" }]`);
    }
    else {
      optionArr.push('type: Types.ObjectId');
      optionArr.push(`ref: "${property.ref}"`);
    }
  }
  else {
    propType = property.type;
    const mongooseType = toStartCase(propType);
    optionArr.push(property.isArray ? `type: [${mongooseType}]` : `type: ${mongooseType}`);
  }

  if (property.isArray) propType += '[]';
  for (const key in property) {
    if (['enum', 'required', 'default', 'index', 'unique', 'min', 'max'].includes(key)) {
      const propVal = property[key];
      if (key == 'enum')
        optionArr.push(`${key}: ${property.name.toUpperCase()}_ENUM`);
      else if (typeof propVal == 'string')
        optionArr.push(`${key}: "${propVal}"`);
      else if (typeof propVal == 'object')
        optionArr.push(`${key}: ${JSON.stringify(propVal)}`);
      else
        optionArr.push(`${key}: ${propVal}`);
    }
  }

  const schemaOptions = optionArr.join(', ');
  return `\t@Prop({ ${schemaOptions} })\n`
    + `\t${property.name}: ${propType};\n`
    + `\n//Prop`;
}

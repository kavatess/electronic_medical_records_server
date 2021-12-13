import { IProperty } from "../config.interface";

export function addArrayUpdateDto(property: IProperty) {
  let propType = 'string';
  const decoratorArr = ['IsOptional'];
  if (property.type == 'string') {
    decoratorArr.push('IsNotEmpty');
  }
  else if (property.type == 'Date') {
    propType = 'Date';
    decoratorArr.push('IsDateString');
  }
  else if (property.type == 'object') {
    propType = property.name.charAt(0).toUpperCase() + property.name.slice(1) + 'Dto';
    decoratorArr.push(`ValidateNested`);
    decoratorArr.push(`Type`);
  }
  else {
    if (property.type != 'mongoId') propType = property.type;
    decoratorArr.push(`Is${property.type.charAt(0).toUpperCase() + property.type.slice(1)}`);
  }

  decoratorArr.push('ApiProperty');
  const apiProperties = [];
  for (const key in property) {
    if (['name', 'type', 'required', 'enum', 'example'].includes(key)) {
      const propVal = property[key];
      if (key == 'enum')
        apiProperties.push(`${key}: ${property.name.toUpperCase()}_ENUM`);
      else if (key == 'type')
        apiProperties.push(`${key}: ${propType.charAt(0).toUpperCase() + propType.slice(1)}`);
      else if (typeof propVal == 'string')
        apiProperties.push(`${key}: "${propVal}"`);
      else if (typeof propVal == 'object')
        apiProperties.push(`${key}: ${JSON.stringify(propVal)}`);
      else
        apiProperties.push(`${key}: ${propVal}`);
    }
  }

  let propertyDto = '';
  decoratorArr.forEach(decorator => {
    propertyDto += `\t@${decorator}(`;
    if (decorator == 'Type') {
      propertyDto += `() => ${propType}`;
    }
    else if (decorator == 'IsIn') {
      propertyDto += `${property.name.toUpperCase()}_ENUM`;
    }
    else if (decorator == 'ApiProperty') {
      propertyDto += `{ ${apiProperties.join(', ')} }`;
    }
    propertyDto += ')\n';
  });
  propertyDto += `\treadonly ${property.name}?: ${propType};\n`;
  propertyDto += `\n//Prop`;
  return propertyDto;
}

import { IProperty } from '../config.interface';

export function searchEnumProperties(property: IProperty, enumProperties: IProperty[] = []) {
    if (property.enum) {
        if (property.enum.length) {
            enumProperties.push(property);
        }
    }
    const childProperties = property.properties;
    if (childProperties) {
        if (childProperties.length) {
            for (const childProperty of childProperties) {
                searchEnumProperties(childProperty, enumProperties);
            }
        }
    }
    return enumProperties;
}

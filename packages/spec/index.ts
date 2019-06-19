// Rolling development version of the UDT schema
import * as udtSchemaDev from './schemas/dev/udt-schema.json';

/**
 * Metadata and JSON schema for a specific UDT spec version.
 */
interface UdtSpecInfo {
  /**
   * The `$id` URI that uniquely identifies this UDT spec version.
   */
  id: string;

  /**
   * The full JSON schema for this UDT spec version.
   */
  schema: any;
}

/**
 * Generates the spec info object from a given UDT JSON schema.
 *
 * @param schema   UDT JSON schema object.
 */
function schemaInfo(schema: any): UdtSpecInfo {
  return {
    id: schema['$id'],
    schema
  };
}

/**
 *  Metadata and JSON schemas for each published UDT spec version.
 */
export default {
  /**
   * The rolling development version of the UDT spec.
   */
  dev: schemaInfo(udtSchemaDev)
};

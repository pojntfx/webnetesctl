import yaml from "js-yaml";
import { JSONCrush, JSONUncrush } from "jsoncrush";

/**
 * urlencodeYAMLAll compresses and URL encodes multiple YAML documents
 *
 * @param yamlData Multiple YAML documents to URL encode
 */
export const urlencodeYAMLAll = (yamlData: any) =>
  JSONCrush(JSON.stringify(yaml.safeLoadAll(yamlData)));

/**
 * urldecodeYAMLAll decompresses and URL decodes multiple YAML documents
 *
 * @param urlencodedYAML Multiple URL-encoded and compressed YAML documents
 */
export const urldecodeYAMLAll = (urlencodedYAML: string) =>
  (JSON.parse(JSONUncrush(urlencodedYAML)) as string[])
    .map((doc) => yaml.safeDump(doc))
    .join("---\n");

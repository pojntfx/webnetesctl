import yaml from "js-yaml";
import { JSONCrush, JSONUncrush } from "jsoncrush";

export const urlencodeYAMLAll = (yamlData: any) =>
  JSONCrush(JSON.stringify(yaml.safeLoadAll(yamlData)));

export const urldecodeYAMLAll = (urlencodedYAML: string) =>
  (JSON.parse(JSONUncrush(urlencodedYAML)) as string[])
    .map((doc) => yaml.safeDump(doc))
    .join("---\n");

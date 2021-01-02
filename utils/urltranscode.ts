import yaml from "js-yaml";
import { JSONCrush } from "jsoncrush";

export const urlencodeYAML = (yamlData: any) =>
  JSONCrush(JSON.stringify(yaml.safeLoadAll(yamlData)));

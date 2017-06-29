declare module 'xmldom' {
  export class DOMParser {
    /**
     * @param xmlsource
     * @param mimetype
     * @return document
     */
    public parseFromString(xmlsource: string, mimetype: string): Document;
  }

  export class XMLSerializer {
    /**
     * @param document
     * @return xmlstring
     */
    public serializeToString(document: Document): string;
  }
}


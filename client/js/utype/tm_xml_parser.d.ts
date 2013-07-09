/// <reference path="../../../d.ts/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="interface.d.ts" />
declare module utype {
    class TmXmlParser {
        static parse(xmlFilePath: string, callback: (lyrics: utype.Lyric[]) => void): void;
    }
}

/// <reference path="../../d.ts/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="interface.d.ts" />

module utype {

    export class TmXmlParser {

        /**
         * 指定パスのtm(タイピングマニア)形式のXMLを読み込んで歌詞情報にパースする
         * @param xmlFilePath
         * @param callback
         */
        public static parse(xmlFilePath: string, callback: (lyrics: utype.Lyric[]) => void): void {
            jQuery.get(xmlFilePath).done((data) => {
                var lyrics: utype.Lyric[] = [];
                var count = parseInt($(data).find('saidaimondaisuu').text());
                var durations = <any> $(data).find('interval').map((i, elem) => parseInt(jQuery(elem).text()));
                var originalLyrics = <any> $(data).find('nihongoword').map((i, elem) => jQuery(elem).text());
                var kanaLyrics = <any> $(data).find('word').map((i, elem) => jQuery(elem).text());

                for (var i = 0; i < count; i++) {
                    lyrics.push({
                        duration: durations[i],
                        originalLyric: originalLyrics[i],
                        kanaLyric: kanaLyrics[i]
                    });
                }
                callback(lyrics);
            });
        }
    }
}

/// <reference path="../../d.ts/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="utype/lyric_set.d.ts" />
/// <reference path="utype/game.d.ts" />
/// <reference path="utype/video_player.d.ts" />
/// <reference path="utype/view.d.ts" />
declare var testLyrics: {
    duration: number;
    originalLyric: string;
    kanaLyric: string;
}[];
declare var tag: HTMLScriptElement;
declare var firstScriptTag: HTMLScriptElement;
declare var youTubeReady: JQueryDeferred;
declare function onYouTubeIframeAPIReady(): void;
declare var documentReady: JQueryDeferred;
declare function focusToDocument(): void;
declare var gameReady: JQueryPromise;

/// <reference path="../../d.ts/DefinitelyTyped/jasmine/jasmine.d.ts" />
/// <reference path="../../client/scripts/utype/typing_logic.ts" />

describe('タイピングロジックは', function() {

    var typing: utype.TypingLogic;

    beforeEach(function() {
        typing = new utype.TypingLogic();
    });

    it('複数の問題文を与えたとき打鍵数を加算してくれる', function() {
        typing.registerSubject('あ');
        typing.type('a');
        typing.registerSubject('い');
        typing.type('i');

        expect(typing.getTotalTypedCount()).toBe(2);
    });
})

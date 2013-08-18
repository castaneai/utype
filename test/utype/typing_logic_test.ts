/// <reference path="../../d.ts/DefinitelyTyped/jasmine/jasmine.d.ts" />
/// <reference path="../../client/scripts/utype/typing_logic.ts" />

describe('タイピングロジックは', function() {

    var typing: utype.TypingLogic;

    beforeEach(function() {
        typing = new utype.TypingLogic();
    });

    it('複数の問題文を与えたとき打鍵数を加算してくれる', function() {
        typing.registerSubject('お');
        typing.type('o');
        expect(typing.getTotalTypedCount()).toBe('o'.length);

        typing.registerSubject('こ');
        typing.type('k');
        typing.type('o');
        expect(typing.getTotalTypedCount()).toBe('oko'.length);

        typing.registerSubject('nano');
        typing.type('n');
        typing.type('a');
        typing.type('n');
        typing.type('o');
        expect(typing.getTotalTypedCount()).toBe('okonano'.length);
    });
})

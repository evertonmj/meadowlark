suite('"About" Page Tests', function(){
    test('page should containt link to contact page', function(){
        assert($('a[href="/contact"]').length);
    });
});

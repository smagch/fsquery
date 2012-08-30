# Traverse file systems in a jQuery-like way

```
+ /tmp
  + hoge
    hello.txt
    world.txt
  + foo
    foobar2000.txt
  + bar
    pub-and-bar.txt
  hoge.txt
  foo.txt
  bar.txt
```

```javascript
fsQuery('/tmp').childern(':dir')
  .map(function (filename) {
    return 'hello-' + filename;
  })
  .get(function (err, results) {
    // results = ['hello-hoge', 'hello-foo', 'hello-bar']
  });
```
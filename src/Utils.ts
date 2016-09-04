/**
 *
 * @author 
 *
 */
function format(s: string, ...args: any[]):string
{
    return s.replace(/\{(\d+)\}/g,
        function(m, i)
        {
            return args[i];
        });
}

function MapLength(m):number {
    var n=0;
    for(var i in m) {
        ++n;
    }
    return n;
}

function MapSum(l):number
{
    var n=0;
    for(var i in l) {
        n+=l[i];
    }
    return n;
}

function MapKeys(m):Array<any> {
    var l = [];
    for (var i in m) {
        l.push(i);
    }
    return l;
}

function MapValues(m): Array<any> {
    var l=[];
    for(var i in m) {
        l.push(m[i]);
    }
    return l;
}

function isInArray(a:Array<any>, n:any):Boolean {
    for (var i in a) {
        if ( a[i] == n ) {
            return true;
        }
    }
    return false;
}

function countArray(a:Array<any>):{} {
    var m = {};
    for (var i=0; i<a.length; ++i) {
        var v = a[i];
        if (m[v] == null) {
            m[v] = 1;
        }
        else {
            m[v]++;
        }
    }
    return m;
}

function MapEqual(l1:Array<any>, l2:Array<any>):Boolean {
    return l1.toString() == l2.toString();
}

function RandInt(a: number, b: number): number
{
    return Math.floor(Math.random()*(b-a+1)+a);
}

function RandChoice(l: Array<any>): any
{
    return l[RandInt(0, l.length-1)];
}

function Shuffle(l: Array<any>):void
{
    var n=l.length;
    for(var i=0;i<n-1;++i) {
        var j=RandInt(i, n-1);
        var temp=l[i];
        l[i]=l[j];
        l[j]=temp;
    }
}

function log(arg0: any, ...args: any[]):void {
    console.log( arg0, ...args );
}

function error(arg0: any, ...args: any[]):void {
    console.log(arg0, ...args);
}

function LocalPosByNormalizePos_Box(b:p2.Body, pos:number[]): number[]
{
    var shape = <p2.Box>(b.shapes[0]);
    if (shape == null) {
        return [null, null];
    }
    var w = shape.width;
    var h = shape.height;
    return [w/2*pos[0], h/2*pos[1]];
}

function LocalPosByNormalizePos_Circle(c:p2.Body, pos:number[]): number[]
{
    var shape = <p2.Circle>(c.shapes[0]);
    if (shape == null) {
        return [null, null];
    }
    var w = shape.radius;
    var h = shape.radius;
    return [w*pos[0], h*pos[1]];
}

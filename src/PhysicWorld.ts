class PhysicWorld
{
    private _world : p2.World;
    public _factor = 50;
    
    public stageWidth = 0;
    public stageHeight = 0;

    public Init(){
        //创建world
        this._world = new p2.World();
        this._world.sleepMode = p2.World.BODY_SLEEPING;
        this.stageWidth = g.stageWidth / this._factor;
        this.stageHeight = g.stageHeight / this._factor;
    }

    public Tick(dt:number)
    {
        this._world.step(dt / 1000);
    }
    
    public createPlane(x:number, y:number, rotation:number = 0, display:egret.DisplayObject = null)
    {
        var planeShape: p2.Plane = new p2.Plane();
        var planeBody: p2.Body = new p2.Body();
        planeBody.addShape(planeShape);
        if (display) {
            planeBody.displays = [display];
        }
        planeBody.position = [x, y];
        this._world.addBody(planeBody);
    }
    
    public World() : p2.World {
        return this._world;
    }
    
    public CreateCircle(radius:number, params={}) : p2.Body
    {
        var boxShape: p2.Shape = new p2.Circle({radius: radius});
        var m = {mass:1};
        for (var p in params) {
            m[p] = params[p];
        }
        var boxBody: p2.Body = new p2.Body(m);
        boxBody.addShape(boxShape);
        
        function _drawCircle(radius:number):egret.Shape {
            var shape:egret.Shape = new egret.Shape();
            shape.graphics.beginFill(0xff0000);
            shape.graphics.drawCircle(radius, radius, radius);
            shape.graphics.endFill();
            return shape;
        }
        var display = _drawCircle((<p2.Circle>boxShape).radius * this._factor);
        display.width = (<p2.Circle>boxShape).radius * 2 * this._factor;
        display.height = (<p2.Circle>boxShape).radius * 2 * this._factor;
        display.anchorOffsetX = display.width / 2;
        display.anchorOffsetY = display.height / 2;
        
        boxBody.displays = [display];
        this._world.addBody(boxBody);
        
        return boxBody;
    }
    
    public CreateRect(width:number, height:number, params={}) : p2.Body  {
        var boxShape: p2.Shape = new p2.Box({width:width, height:height});
        var m = {mass:1};
        for (var p in params) {
            m[p] = params[p];
        }
        var boxBody: p2.Body = new p2.Body(m);
        boxBody.addShape(boxShape);
        
        function _drawRect(w:number, h:number):egret.Shape {
            var shape:egret.Shape = new egret.Shape();
            shape.graphics.beginFill(0xff0000);
            shape.graphics.drawRect(0, 0, w, h);
            shape.graphics.endFill();
            return shape;
        }
        
        var boxShape_t = <p2.Box>boxShape;
        var w = boxShape_t.width * this._factor;
        var h = boxShape_t.height* this._factor;
        var display = _drawRect(w, h);
        display.width = w;
        display.height = h;
        display.anchorOffsetX = display.width / 2;
        display.anchorOffsetY = display.height / 2;
        
        boxBody.displays = [display];
        this._world.addBody(boxBody);
        
        return boxBody;
    }
}

var pw = new PhysicWorld();

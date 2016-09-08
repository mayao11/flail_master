//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;
    
    public RegTicker() {
        egret.Ticker.getInstance().register(function(dt) {
            if (dt < 10) {
                return;
            }
            if (dt > 1000) {
                return;
            }
            var angle = g.arm.angle % (2*Math.PI);
            if (angle < 0) {
                angle += 2*Math.PI;
            }
            var STADY_P = 10;
            var _2PI = 2*Math.PI;
            var FRONT_ANGLE = 7/8 * _2PI;//7/8 * 2*Math.PI;
            var BACK_ANGLE = 3/8 * _2PI;
            var force_point = LocalPosByNormalizedPos_Box(g.arm, [1,0]);
            function pushArm(diff_angle:number, dir:number) {
                g.arm.applyForceLocal([0,8*STADY_P/_2PI*diff_angle*dir],  force_point);
                //g.arm.applyForceLocal([0,STADY_P*dir],  force_point);
            }
            if (g.arm_state == 0) {
                if (angle<FRONT_ANGLE && angle>4/8 * _2PI) {
                    //g.arm.angularVelocity = -STADY_P;
                    //g.arm.applyForceLocal([0,STADY_P],  force_point)
                    pushArm(FRONT_ANGLE-angle, 1);
                }
                else {
                    //g.arm.angularVelocity = STADY_P;
                    //g.arm.applyForceLocal([0,-STADY_P],  force_point)
                    if (angle >FRONT_ANGLE) {
                        pushArm(angle-FRONT_ANGLE, -1);
                    }
                    else {
                        pushArm(angle + 1/8*_2PI, -1);
                    }
                }
            }
            else {
                if (angle<BACK_ANGLE || angle>6/8 * 2*Math.PI) {
                    //g.arm.angularVelocity = -STADY_P;
                    //g.arm.applyForceLocal([0,STADY_P],  force_point)
                    if (angle < BACK_ANGLE) {
                        pushArm(BACK_ANGLE-angle, 1);
                    }
                    else {
                        pushArm(_2PI - angle + BACK_ANGLE, 1);
                    }
                }
                else {
                    //g.arm.angularVelocity = STADY_P;
                    //g.arm.applyForceLocal([0,-STADY_P],  force_point)
                    pushArm(angle-BACK_ANGLE, -1);
                }

            }
            pw.Tick(dt);
            var w = pw.World();
            var fac = pw._factor;
            var len = w.bodies.length;
            for (var i: number = 0; i < len; i++) {
                var boxBody: p2.Body = w.bodies[i];
                if (!boxBody.displays || boxBody.displays.length==0){
                    continue;
                }
                var box: egret.DisplayObject = boxBody.displays[0];
                if (box) {
                    box.x = boxBody.position[0] * fac;
                    box.y = g.stageHeight - boxBody.position[1] * fac;
                    box.rotation = 360 - (boxBody.angle + boxBody.shapes[0].angle) * 180 / Math.PI;
                    if (boxBody.sleepState == p2.Body.SLEEPING) {
                        box.alpha = 0.5;
                    }
                    else {
                        box.alpha = 1;
                    }
                }
            }
        }, this);
    }
    
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        g.stageWidth = this.stage.stageWidth;
        g.stageHeight = this.stage.stageHeight;
        
        pw.Init();
        
        pw.createPlane(0,4);
        
    /*
        con.enableMotor() ;
        con.setMotorSpeed(5);
    */
    
        var fix_circle = pw.CreateCircle(0.2, {type:p2.Body.STATIC});
        fix_circle.position = [pw.stageWidth/2, pw.stageHeight/2];
        this.addChild(fix_circle.displays[0]);
        
        var con:p2.RevoluteConstraint;
        var con_lock:p2.LockConstraint;
        var prev_pos:number[];
        var con_pos:number[];
        
        function connect_box_box(b1:p2.Body, b2:p2.Body) {
            var to_pos = [0,0];
            b1.toWorldFrame(to_pos, [1,0]);
            var offset = LocalPosByNormalizedPos_Box(b1, [1,0]);
            b2.position = [to_pos[0]+offset[0], to_pos[1]+offset[1]];
            
            prev_pos = LocalPosByNormalizedPos_Box(b1, [1,0]);
            con_pos = LocalPosByNormalizedPos_Box(b2, [-1,0]);
            con_pos[0] -= 0.1;
            con = new p2.RevoluteConstraint(b1, b2, {localPivotA:prev_pos, localPivotB:con_pos});
            con.collideConnected = false;
            con.setRelaxation(2.5)
            con.setStiffness(1e10);
            pw.World().addConstraint(con);
        }
        
        var b1 = pw.CreateRect(1.5, 0.1, {mass:0.1});
        this.addChild(b1.displays[0]);
        var to_pos = [0,0];
        fix_circle.toWorldFrame(to_pos, [0,0]);
        var offset = LocalPosByNormalizedPos_Box(b1, [1,0]);
        b1.position = [to_pos[0]+offset[0], to_pos[1]+offset[1]];
        prev_pos = [0,0];
        con_pos = LocalPosByNormalizedPos_Box(b1, [-1, 0]);
        con_pos[0] -= 0.2;
        con = new p2.RevoluteConstraint(fix_circle, b1, {localPivotA:prev_pos, localPivotB:con_pos});
        con.collideConnected = false;
        pw.World().addConstraint(con);
        g.arm = b1;
        
        var weapon_length = 5;
        var l_boxes: Array<p2.Body> = [];
        l_boxes.push(b1);
        for (var i=0; i<weapon_length; ++i) {
            var new_box = pw.CreateRect(0.3, 0.1, {mass:0.03});
            l_boxes.push(new_box);
            this.addChild(new_box.displays[0]);
        }
        for (var i=0; i<weapon_length; ++i) {
            connect_box_box(l_boxes[i], l_boxes[i+1]);
        }
        
        var heavy_circle = pw.CreateCircle(0.3, {mass:0.05});
        this.addChild(heavy_circle.displays[0]);
        var last_box = l_boxes[l_boxes.length-1];
        var to_pos = [0,0];
        last_box.toWorldFrame(to_pos, [0,0]);
        heavy_circle.position = [to_pos[0], to_pos[1]];
        prev_pos = LocalPosByNormalizedPos_Box(last_box, [1,0]);
        prev_pos[0] += 0.3;
        con_pos = [0,0];
        con = new p2.RevoluteConstraint(last_box, heavy_circle, {localPivotA:prev_pos, localPivotB:con_pos});
        pw.World().addConstraint(con);
        
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt:egret.TouchEvent) => {
            g.arm_state = g.arm_state==1 ? 0 : 1;
        }, this);
        this.touchEnabled = true;
        this.RegTicker();
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

}



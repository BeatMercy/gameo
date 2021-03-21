import { Math2D, vec2 } from "../math2d"

export default class AstarAlgorithm {
    public sourceMap: Array<Array<number>>  // 二维地图数字数组
    public pathMap: Array<Array<number>> // sourceMap钟的路径，标识路径经过的点
    public COST_OF_STRAIGHT: number = 10
    public COST_OF_SKEW: number = 15
    public pathChain: Array<vec2>

    public startPos: vec2
    public endPos: vec2

    constructor(sourceMap: Array<Array<number>>) {
        this.sourceMap = sourceMap
        this.pathMap = this.sourceMap
    }

    public caculatePathChain(): Array<vec2> {
        const pathChain: Array<PathNode> = []
        let curPos = this.startPos
        while (curPos.x !== this.endPos.x && curPos.y !== this.endPos.y) {
            const curPathNodes = this.surPathNode(curPos)
                .filter(n => this.isPosInMap(n.pos))
            if (curPathNodes.length == 0) break
            curPathNodes.forEach(n => n.buildCost(curPos, this.COST_OF_STRAIGHT))
            // 获得F最少的点作为下一步落脚点
            const nextNode = curPathNodes.reduce((pre, cur) => cur.f < pre.f ? cur : pre)
            pathChain.push(nextNode)
            curPos = nextNode.pos
        }
        return pathChain.map(p => p.pos)
    }

    private surPathNode(pos: vec2): Array<PathNode> {
        const dirs: any = {
            up: new vec2(0, -1),
            rUp: new vec2(1, -1),
            right: new vec2(1, 0),
            rBot: new vec2(1, 1),
            bot: new vec2(0, 1),
            lBot: new vec2(-1, 1),
            left: new vec2(-1, 0),
            lUp: new vec2(-1, -1)
        }
        return Object.keys(dirs).map((k) => {
            const pathNode = new PathNode()
            pathNode.pos = new vec2(pos.x + dirs[k].x, pos.y + dirs[k].y)
            if (/{A-Z}+/.test(k))
                pathNode.g = this.COST_OF_SKEW// 斜角
            else
                pathNode.g = this.COST_OF_STRAIGHT
            return pathNode
        })

    }

    private isPosInMap(pos: vec2): boolean {
        return pos.y > 0 && pos.y < this.sourceMap.length
            && pos.x > 0 && pos.x < this.sourceMap[pos.x].length
            && this.sourceMap[pos.y][pos.x] !== 1 // 地图不为墙
            && !this.pathMap[pos.y][pos.x] // 路径地图未标识
    }

}

class PathNode {
    public pos: vec2
    public g: number // g =》 步数代价
    public h: number // h =》终点x, y 代价 
    public f: number // f =》总代价

    buildCost(curPos: vec2, cost: number): void {
        this.h = cost * (Math.abs(this.pos.x - curPos.x) + Math.abs(this.pos.y - curPos.y))
        this.f = this.g + this.h
    }

}


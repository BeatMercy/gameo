import { vec2 } from "../math2d"

export default class AstarAlgorithm {
    public sourceMap: Array<Array<number>>  // 二维地图数字数组
    public COST_OF_STRAIGHT: number = 10
    public COST_OF_SKEW: number = 14
    public pathChain: Array<vec2>

    public startPos: vec2
    public endPos: vec2
    private dirs: any = {
        bot: new vec2(0, 1),
        lBot: new vec2(-1, 1),
        left: new vec2(-1, 0),
        up: new vec2(0, -1),
        rUp: new vec2(1, -1),
        right: new vec2(1, 0),
        rBot: new vec2(1, 1),
        lUp: new vec2(-1, -1)
    }

    constructor(sourceMap: Array<Array<number>>) {
        this.sourceMap = sourceMap
    }

    public caculatePathChain(): Array<vec2> {
        const openList: Array<PathNode> = []
        const closeList: Array<PathNode> = []

        const startNode = new PathNode()
        startNode.pos = this.startPos
        startNode.f = 0
        openList.push(startNode) // 添加起点到openList

        let curPos = this.startPos
        while (curPos.x !== this.endPos.x || curPos.y !== this.endPos.y) {
            const curPathNodes = this.surPathNode(curPos)
                .filter(n => this.isPosInMap(n.pos))// 路径地图未标识
            let spliceIndex = -1
            openList.find((e, i) => {
                if (e.pos.x === curPos.x && e.pos.y === curPos.y) {
                    spliceIndex = i
                    return true
                }
                return false
            })
            openList.splice(spliceIndex, 1)

            if (curPathNodes.length == 0) break
            curPathNodes.forEach(n => n.buildCost(this.endPos, this.COST_OF_STRAIGHT))
            // 获得F最少的点作为下一步落脚点
            const nextNode = curPathNodes.reduce((pre, cur) => cur.f < pre.f ? cur : pre)
            curPos = nextNode.pos
        }
        return []
    }

    private surPathNode(pos: vec2): Array<PathNode> {
        return Object.keys(this.dirs).map((k) => {
            const pathNode = new PathNode()
            pathNode.pos = new vec2(pos.x + this.dirs[k].x, pos.y + this.dirs[k].y)
            if (/[A-Z]+/.test(k))
                pathNode.g = this.COST_OF_SKEW// 斜角
            else
                pathNode.g = this.COST_OF_STRAIGHT
            return pathNode
        })
    }

    private isPosInMap(pos: vec2): boolean {
        return pos.y >= 0 && pos.y < this.sourceMap.length
            && pos.x >= 0 && pos.x < this.sourceMap[pos.y].length
            && this.sourceMap[pos.y][pos.x] !== 1 // 地图不为墙
    }

}

class PathNode {
    public pos: vec2
    public g: number // g =》 步数代价
    public h: number // h =》终点x, y 代价 
    public f: number // f =》总代价
    public parent: PathNode

    buildCost(endPos: vec2, straightCost: number): void {
        this.h =
            straightCost * (Math.abs(this.pos.x - endPos.x) + Math.abs(this.pos.y - endPos.y))
        this.f = this.g + this.h
    }


}


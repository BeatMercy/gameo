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

    public caculateVecChain(): Array<vec2> {
        let endLeaf = this.caculateEndPathLeaf()
        const paths = new Array<PathNode>()
        while (endLeaf.parent) {
            paths.unshift(endLeaf.parent)
            endLeaf = endLeaf.parent
        }
        return paths.map(n => n.pos)
    }
    
    public caculateEndPathLeaf(): PathNode {
        const openList: Array<PathNode> = []
        const closeList: Array<PathNode> = []

        const startNode = new PathNode()
        startNode.pos = this.startPos

        closeList.push(startNode) // 添加起点到openList

        let curNode = startNode
        let curPos = curNode.pos
        while (curPos.x !== this.endPos.x || curPos.y !== this.endPos.y) {
            const curPathNodes = this.surPathNode(curNode)
                .filter(n => this.isPosInMap(n.pos))// 路径地图未标识
            curPathNodes.forEach(n => n.buildCost(this.endPos, this.COST_OF_STRAIGHT))
            if (curPathNodes.length == 0) break

            // 加入 openlist
            curPathNodes.forEach((node: PathNode) => {
                const inCloseNode = closeList.find((n) => n.pos.x === node.pos.x && n.pos.y === node.pos.y)
                if (inCloseNode) return  // close list 中的节点不处理

                const inOpenNode = openList.find((n) => n.pos.x === node.pos.x && n.pos.y === node.pos.y)
                if (!inOpenNode) {
                    openList.push(node)
                } else if (inOpenNode.g > curNode.g) {
                    // 若原节点的g值大于当前节点，替换旧的节点父亲节点
                    inOpenNode.parent = curNode
                }
            })

            // 从 open list 中选择下一个待处理的方格, 获得F最少的点作为下一步落脚点
            if (openList.length === 0) { break }
            if (openList.length === 1) {
                const nextNode = openList.splice(0, 1)[0]
                closeList.push(nextNode)
                curNode = nextNode
                curPos = curNode.pos
            } else {
                let spliceIndex = 0
                const nextNode = openList.reduce((pre, cur, curIdx) => {
                    if (cur.f < pre.f) {
                        spliceIndex = curIdx
                        return cur
                    }
                    return pre
                })
                closeList.push(openList.splice(spliceIndex, 1)[0])
                curNode = nextNode
                curPos = curNode.pos
            }
        }
        
        return curNode;
    }

    private surPathNode(parentNode: PathNode): Array<PathNode> {
        const pos = parentNode.pos
        return Object.keys(this.dirs).map((k) => {
            const pathNode = new PathNode()
            pathNode.pos = new vec2(pos.x + this.dirs[k].x, pos.y + this.dirs[k].y)
            pathNode.parent = parentNode
            if (/[A-Z]+/.test(k))
                pathNode.g = this.COST_OF_SKEW//?斜角
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



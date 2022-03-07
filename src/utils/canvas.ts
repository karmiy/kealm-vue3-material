export class Sequence {
    public sequence = 1;

    public next() {
        return this.sequence++;
    }
}

export const sequence = new Sequence();

/**
 * @description 生成模板项 id 序列号
 * @returns
 */
export const generateTplSeries = () => {
    return new Date().getTime() + '_' + sequence.next();
};

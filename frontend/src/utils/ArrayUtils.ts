export const mergeArray = (arr1: any[], arr2: any[]) => {
    return [...new Set([...arr1, ...arr2])]
}

export const removeArray = (arr1: any[], arr2: any[]) => {
    return arr1.filter((item) => !arr2.includes(item))
}
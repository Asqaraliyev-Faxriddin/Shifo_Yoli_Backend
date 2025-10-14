function convertBigIntToString2(obj) {
    if (typeof obj === "bigint")
        return obj.toString();
    if (Array.isArray(obj))
        return obj.map(convertBigIntToString2);
    if (obj && typeof obj === "object") {
        const res = {};
        for (const key in obj) {
            res[key] = convertBigIntToString2(obj[key]);
        }
        return res;
    }
    return obj;
}
//# sourceMappingURL=uew.js.map

const ROOT_STRINGS = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    number: '0123456789',
    symbol: "@$!%*#?&",
};

/**
 * [vi] Password tự động
 * @param {number} minLength độ dài chuỗi tối thiểu
 * @param {number} maxLength độ dài chuỗi tối đa
 * @param {boolean} lowercase bắt buộc ký tự thường
 * @param {boolean} uppercase bắt buộc ký tự hoa
 * @param {boolean} symbols bắt buộc ký tự đặc biệt
 * @param {boolean} numbers bắt buộc số
 * @return {string} password ngẫu nhiên
 */
export default function randomPassword(
    minLength: number,
    maxLength: number,
    lowercase: boolean,
    uppercase: boolean,
    symbols: boolean,
    numbers: boolean): string {

    let passwordCharSet = "";
    let passReq = "";
    let password = "";

    let length = Math.random() * (maxLength - minLength) + minLength;

    // chữ thường
    if (lowercase) {
        passwordCharSet += ROOT_STRINGS.lowercase;
        passReq += ROOT_STRINGS.lowercase[Math.floor(Math.random() * ROOT_STRINGS.lowercase.length)];
        length = length - 1;
    };

    // chữ hoa
    if (uppercase) {
        passwordCharSet += ROOT_STRINGS.uppercase;
        passReq += ROOT_STRINGS.uppercase[Math.floor(Math.random() * ROOT_STRINGS.uppercase.length)];
        length = length - 1;
    };

    // ký tự
    if (symbols) {
        passwordCharSet += ROOT_STRINGS.symbol;
        passReq += ROOT_STRINGS.symbol[Math.floor(Math.random() * ROOT_STRINGS.symbol.length)];
        length = length - 1;
    };

    // con số
    if (numbers) {
        passwordCharSet += ROOT_STRINGS.number;
        passReq += ROOT_STRINGS.number[Math.floor(Math.random() * ROOT_STRINGS.number.length)];
        length = length - 1;
    };

    // nhặt chuỗi
    for (let i = 0; i < length; i++) {
        password += passwordCharSet[Math.floor(Math.random() * passwordCharSet.length)]
    }

    // đảm bảo chuỗi
    password = password + passReq;
    
    // trộn chuỗi
    return [...password].sort(() => Math.random() - .5).join('');
};

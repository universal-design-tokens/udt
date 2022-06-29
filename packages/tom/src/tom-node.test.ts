import { isValidName } from './tom-node';

describe('isValidName()', () => {
    it('accepts strings that are empty or only contain whitespace', () => {
        const testNames = ['', '  ', '\t\n'];

        testNames.forEach(name => {
            expect(isValidName(name)).toBe(true);
        });
    });

    it('accepts strings in different scripts', () => {
        const testNames = ['test-token', 'DésîgnTökèn', '드사이느'];

        testNames.forEach(name => {
            expect(isValidName(name)).toBe(true);
        });
    });

    it('rejects any string beginning with $', () => {
        const testNames = ['$test-token', '$', '$$$'];

        testNames.forEach(name => {
            expect(isValidName(name)).toBe(false);
        });
    });

    it('accepts strings in that contain $ anywhere but the first character', () => {
        const testNames = [' $', 'moneyz$$$'];

        testNames.forEach(name => {
            expect(isValidName(name)).toBe(true);
        });
    });
});
declare global {
    // tslint:disable-next-line
    interface String {
        isNumber: () => boolean;
    }

    // tslint:disable-next-line
    interface StringConstructor {
        isNumber: (value: string | null | undefined) => boolean;
    }
}

String.isNumber = (value: string | null | undefined): boolean => {
    if (null === value || undefined === value) {
        return false;
    }

    return !Number.isNaN(Number(value));
};

String.prototype.isNumber = function(): boolean {
    return !Number.isNaN(Number(this));
};

export {};

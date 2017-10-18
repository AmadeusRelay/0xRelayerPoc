import * as moment from 'moment';
import * as BigNumber from 'bignumber.js';
import * as _ from 'lodash';

export const Utils = {
    toUnixTimestamp(date: moment.Moment) : BigNumber.BigNumber {
        return new BigNumber(date.unix());
    },
    toBaseUnit(unit: number) : BigNumber.BigNumber {
        return Utils.toBaseUnitWithDecimals(unit, undefined);
    },
    toBaseUnitWithDecimals(unit: number, decimals: number) : BigNumber.BigNumber {
        if (_.isUndefined(decimals) || !_.isNumber(decimals)) {
            decimals = 18;
        }
        const toUnit = new BigNumber(10).pow(decimals);
        const baseUnitAmount = new BigNumber(unit).times(toUnit);
        return baseUnitAmount;
    }
};
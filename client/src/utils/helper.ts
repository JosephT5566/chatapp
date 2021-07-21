import _ from 'lodash';

export const isArrayEqual = <T>(array1: Array<T>, array2: Array<T>): boolean => {
	return _.isEqual(array1.sort(), array2.sort());
};

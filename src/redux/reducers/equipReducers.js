import * as actionType from '../constants/equipConstants';


export const getEquipmentsReducer = (state = { equipments: [] }, action) => {
    switch (action.type) {
        case actionType.GET_PRODUCT_SUCCESS:
            return { equipments: action.payload }

        case actionType.GET_PRODUCT_FAIL:
            return { error: action.payload }

        default:
            return state;

    }
}

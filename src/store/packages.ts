import { isNil } from 'lodash';

import {
  BsPackage,
  // PackageDependency,
  // PackageVersionSelectorType,
} from '../interfaces';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_PACKAGE = 'ADD_PACKAGE';
export const ADD_PACKAGE_DEPENDENCY = 'ADD_PACKAGE_DEPENDENCY';
// export const SET_PACKAGE_VERSION_SELECTOR = 'SET_PACKAGE_VERSION_SELECTOR';
// export const SET_SELECTED_TAG_INDEX = 'SET_SELECTED_TAG_INDEX';
// export const SET_SELECTED_BRANCH_NAME = 'SET_SELECTED_BRANCH_NAME';
// export const SET_SPECIFIED_COMMIT_HASH = 'SET_SPECIFIED_COMMIT_HASH';

// ------------------------------------
// Actions
// ------------------------------------
export function addPackage(bsPackage: BsPackage) {
  return {
    type: ADD_PACKAGE,
    payload: bsPackage
  };
}

export function addPackageDependency(bsPackageName: string, dependentPackageName: string,
                                     dependentPackageVersion: string) {
  return {
    type: ADD_PACKAGE_DEPENDENCY,
    payload: {
      bsPackageName,
      dependentPackageName,
      dependentPackageVersion
    }
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState =
  {
    bsPackagesByPackageName: {},
    packageDependencies: {} // maps bsPackage to dependent package dependencies (which is an object of name, version)
  };

export default function(state = initialState, action: any) {

  switch (action.type) {

    case ADD_PACKAGE: {
      const newBsPackagesByPackageName: any = Object.assign({}, state.bsPackagesByPackageName);

      const bsPackage: any = action.payload;
      newBsPackagesByPackageName[bsPackage.name] = bsPackage;

      const newState = {
        bsPackagesByPackageName: newBsPackagesByPackageName,
        packageDependencies: state.packageDependencies

      };

      return newState;
    }

    case ADD_PACKAGE_DEPENDENCY: {

      const { bsPackageName, dependentPackageName, dependentPackageVersion } = action.payload;

      const newPackageDependencies: any = Object.assign({}, state.packageDependencies);

      if (isNil(newPackageDependencies[bsPackageName])) {
        newPackageDependencies[bsPackageName] = {};
      }
      newPackageDependencies[bsPackageName][dependentPackageName] = dependentPackageVersion;

      const newState = {
        bsPackagesByPackageName: state.bsPackagesByPackageName,
        packageDependencies: newPackageDependencies
      };

      console.log(newState);

      return newState;
    }
  }

  return state;
}

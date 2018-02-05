import { isNil } from 'lodash';

import {
  BsPackage,
  DependencyType,
} from '../interfaces';

// ------------------------------------
// Constants
// ------------------------------------
const ADD_PACKAGE = 'ADD_PACKAGE';
const ADD_PACKAGE_DEPENDENCY = 'ADD_PACKAGE_DEPENDENCY';
const ADD_EXTERNAL_PACKAGE = 'ADD_EXTERNAL_PACKAGE';

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
                                     dependentPackageVersion: string, dependencyType: DependencyType) {
  return {
    type: ADD_PACKAGE_DEPENDENCY,
    payload: {
      bsPackageName,
      dependentPackageName,
      dependentPackageVersion,
      dependencyType,
    }
  };
}

export function addExternalPackage(externalPackageName: string) {
  return {
    type: ADD_EXTERNAL_PACKAGE,
    payload: externalPackageName
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState =
  {
    bsPackagesByPackageName: {},
    packageDependencies: {}, // maps bsPackage to dependent package dependencies (which is an object of name, version)
    externalPackages: {} // dependent package name is key; { referenceCount: num }
  };

export default function(state = initialState, action: any) {

  switch (action.type) {

    case ADD_PACKAGE: {
      const newBsPackagesByPackageName: any = Object.assign({}, state.bsPackagesByPackageName);

      const bsPackage: any = action.payload;
      newBsPackagesByPackageName[bsPackage.name] = bsPackage;

      const newState = {
        bsPackagesByPackageName: newBsPackagesByPackageName,
        packageDependencies: state.packageDependencies,
        externalPackages: state.externalPackages
      };

      return newState;
    }

    case ADD_PACKAGE_DEPENDENCY: {

      const { bsPackageName, dependentPackageName, dependentPackageVersion, dependencyType } = action.payload;

      const newPackageDependencies: any = Object.assign({}, state.packageDependencies);

      if (isNil(newPackageDependencies[bsPackageName])) {
        newPackageDependencies[bsPackageName] = {};
      }
      newPackageDependencies[bsPackageName][dependentPackageName] = {
        version: dependentPackageVersion,
        type: dependencyType
      };

      const newState = {
        bsPackagesByPackageName: state.bsPackagesByPackageName,
        packageDependencies: newPackageDependencies,
        externalPackages: state.externalPackages
      };

      console.log(newState);

      return newState;
    }

    case ADD_EXTERNAL_PACKAGE: {

      const newExternalPackages: any = Object.assign({}, state.externalPackages);

      const externalPackageName: string = action.payload;
      if (newExternalPackages.hasOwnProperty(externalPackageName)) {
        const externalPackage: any = newExternalPackages[externalPackageName];
        externalPackage.referenceCount++;
      }
      else {
        newExternalPackages[externalPackageName] = { referenceCount: 1 };
      }

      const newState = {
        bsPackagesByPackageName: state.bsPackagesByPackageName,
        packageDependencies: state.packageDependencies,
        externalPackages: newExternalPackages,
      };

      console.log(newState);

      return newState;
    }
  }

  return state;
}

// ------------------------------------
// Selectors
// ------------------------------------
export const getBsPackageListData = (state: any): any [] => {

  console.log('getBsPackageListData invoked: ', state);

  const bsPackageListData: any = {};

  const bsPackages: any = state.bsPackages;
  const { bsPackagesByPackageName, packageDependencies, externalPackages } = bsPackages;

  for (const bsPackageName in bsPackagesByPackageName) {
    if (bsPackagesByPackageName.hasOwnProperty(bsPackageName)) {

      const bsPackage: any = bsPackagesByPackageName[bsPackageName];
      const bsPackageVersion = bsPackage.currentVersion;

      // get packages that reference this package
      const packagesThatReferenceThisPackage: any = packageDependencies[bsPackageName];
      for (const packageThatReferencesThisPackageName in packagesThatReferenceThisPackage) {
        if (packageThatReferencesThisPackageName.startsWith(('@brightsign'))) {
          if (packagesThatReferenceThisPackage.hasOwnProperty(packageThatReferencesThisPackageName)) {
            const packageThatReferencesThisPackage: any =
              packagesThatReferenceThisPackage[packageThatReferencesThisPackageName];

            const reference: any = {
              name: bsPackageName,
              version: packageThatReferencesThisPackage.version
            };

            const name = packageThatReferencesThisPackageName.substr(12);
            if (!bsPackageListData.hasOwnProperty(name)) {
              bsPackageListData[name] = [];
            }
            bsPackageListData[name].push(reference);
          }
        }
      }
    }
  }

  return bsPackageListData;
};

export const getMultiplyReferencedExternalPackages = (state: any): any [] => {

  const multiplyReferencedPackages: any[] = [];

  const bsPackages: any = state.bsPackages;
  const { bsPackagesByPackageName, packageDependencies, externalPackages } = bsPackages;

  for (const externalPackageName in externalPackages) {
    if (externalPackages.hasOwnProperty(externalPackageName)) {
      const externalPackage: any = externalPackages[externalPackageName];
      if (externalPackage.referenceCount > 1) {
        multiplyReferencedPackages.push(externalPackageName);
      }
    }
  }

  return multiplyReferencedPackages;
}



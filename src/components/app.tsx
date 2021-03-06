import { isNil } from 'lodash';

import * as React from 'react';

import * as fs from 'fs-extra';

// import * as semver from 'semver';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

// import MenuItem from 'material-ui/MenuItem';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
// import RaisedButton from 'material-ui/RaisedButton';
// import SelectField from 'material-ui/SelectField';
// import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
// import TextField from 'material-ui/TextField';

import * as shell from 'shelljs';

import {
  addExternalPackage,
  addPackage,
  addPackageDependency,
  getBsPackageListData,
  getMultiplyReferencedExternalPackages,
} from '../store/packages';

import {
  BsPackage,
  DependencyType,
} from '../interfaces';

class App extends React.Component<any, object> {

  packageBaseDir: string = '/Users/tedshaffer/Documents/bacon-comp/';
  packageNames: string[] = [];

  constructor(props: any){
    super(props);

    // specify packages
    this.packageNames.push('bacon');
    this.packageNames.push('ba-context-model');
    this.packageNames.push('ba-schedule');
    this.packageNames.push('ba-uw-dm');
    this.packageNames.push('ba-uw-manager');
    this.packageNames.push('bacon-theme');
    this.packageNames.push('baconCore');
    this.packageNames.push('bpfImporter');
    this.packageNames.push('bs-content-manager');
    this.packageNames.push('bs-device-artifacts');
    this.packageNames.push('bs-playlist-dm');
    this.packageNames.push('bs-widgets');
    this.packageNames.push('bsCore');
    this.packageNames.push('bsDataModel');
    this.packageNames.push('bsDeviceSetup');
    this.packageNames.push('bsn-ui-v2-ns');
    this.packageNames.push('bsnConnector');
    this.packageNames.push('bsPublisher');
    this.packageNames.push('bsAutoplayGenerator');
    this.packageNames.push('fsConnector');
    this.packageNames.push('fsMetadata');

    // this.configureButtonClicked = this.configureButtonClicked.bind(this);
  }

  componentDidMount() {
    const packageDotJsonVersionsMap: any = this.parseBaconModules();
  }

  parseBaconModules() : void {

    this.packageNames.forEach( (moduleName: string) => {
      this.parseDotJson(moduleName);
    });
  }

  isBaconPackage(packageName: string) : boolean {
    if (packageName.startsWith(('@brightsign'))) {
      return true;
    }
    return false;
  }

  parseDotJson(moduleName: string): void {

    const modulePackageJsonPath = this.packageBaseDir.concat(moduleName + '/package.json');
    const modulePackageJson = fs.readJsonSync(modulePackageJsonPath);

    const module: BsPackage = {
      name: moduleName,
      currentVersion: modulePackageJson.version
    };
    this.props.addPackage(module);

    for (const dependentPackageName in modulePackageJson.dependencies) {
      if (modulePackageJson.dependencies.hasOwnProperty(dependentPackageName)) {
        if (!this.isBaconPackage(dependentPackageName)) {
          this.props.addExternalPackage(dependentPackageName);
        }
        const packageVersionSpec: string = modulePackageJson.dependencies[dependentPackageName];
        this.props.addPackageDependency(moduleName, dependentPackageName,
          packageVersionSpec, DependencyType.Dependency);
      }
    }

    for (const dependentPackageName in modulePackageJson.peerDependencies) {
      if (modulePackageJson.peerDependencies.hasOwnProperty(dependentPackageName)) {
        if (!this.isBaconPackage(dependentPackageName)) {
          this.props.addExternalPackage(dependentPackageName);
        }
        const packageVersionSpec: string = modulePackageJson.peerDependencies[dependentPackageName];
        this.props.addPackageDependency(moduleName, dependentPackageName,
          packageVersionSpec, DependencyType.PeerDependency);
      }
    }
  }

  baconPackageReferencesComparator(a: any, b: any): number {
    if (a.data.length < b.data.length) {
      return 1;
    }
    else if (a.data.length > b.data.length) {
      return -1;
    }
    return 0;
  }

  render() {

    const baconPackageReferences: any[] = [];

    for (const bsPackageName in this.props.bsPackageListData) {
      if (this.props.bsPackageListData.hasOwnProperty(bsPackageName)) {
        baconPackageReferences.push( {
          name: bsPackageName,
          data: this.props.bsPackageListData[bsPackageName],
        });
      }
    }

    console.log(baconPackageReferences);

    const sortedBaconPackageReferences: any[] = baconPackageReferences.sort(this.baconPackageReferencesComparator);
    console.log(sortedBaconPackageReferences);

    const report = fs.createWriteStream('report.txt', {
      flags: 'w'
    })

    report.write('Intra bacon package dependencies\n');

    sortedBaconPackageReferences.forEach((baconPackageReference: any) => {
      report.write(baconPackageReference.name + '\n');
      baconPackageReference.data.forEach((bPackage: any) => {
        report.write('\t' + bPackage.version + '\t\t' + bPackage.name + '\n');
      });
    });

    report.write('\nExternal packages referenced more than once from bacon:\n');
    this.props.multiplyReferencedExternalPackages.forEach( (externalPackageName: string) => {
      report.write(externalPackageName + '\n');
    });
    report.end();

    return (
      <div>Pizza</div>
    );
    // const bsPackageRows: any[] = this.buildPackageRows();

    // return (
    //   <MuiThemeProvider>
    //     <div>
    //
    //       <Table>
    //         <TableHeader
    //           displaySelectAll={false}
    //           adjustForCheckbox={false}
    //           enableSelectAll={false}
    //         >
    //           <TableRow>
    //             <TableHeaderColumn>Package name</TableHeaderColumn>
    //             <TableHeaderColumn></TableHeaderColumn>
    //             <TableHeaderColumn>Current version</TableHeaderColumn>
    //             <TableHeaderColumn>Specified version</TableHeaderColumn>
    //             <TableHeaderColumn>Package Version Selector</TableHeaderColumn>
    //             <TableHeaderColumn>Tags</TableHeaderColumn>
    //             <TableHeaderColumn>Commit Hash</TableHeaderColumn>
    //             <TableHeaderColumn>Branch</TableHeaderColumn>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody
    //           displayRowCheckbox={false}
    //         >
    //           {bsPackageRows}
    //         </TableBody>
    //       </Table>
    //
    //       <RaisedButton label='Configure' onClick={this.configureButtonClicked}/>
    //     </div>
    //   </MuiThemeProvider>
    // );
  }
}

function mapStateToProps(state : any) {
  return {
    bsPackages: state.bsPackages,
    bsPackageListData: getBsPackageListData(state),
    multiplyReferencedExternalPackages: getMultiplyReferencedExternalPackages(state),
  };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return bindActionCreators({
    addExternalPackage,
    addPackage,
    addPackageDependency,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

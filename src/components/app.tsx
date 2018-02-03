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
  addPackage,
  addPackageDependency,
  // setPackageVersionSelector,
  // setSelectedBranchName,
  // setSelectedTagIndex,
  // setSpecifiedCommitHash,
} from '../store/packages';

import {
  BsPackage,
  // BsTag,
  // PackageVersionComparisonType,
  // PackageVersionSelectorType,
  // RecentCommitData,
  // SpecifiedBsPackage,
  // // SpecifiedBsPackageMap,
} from '../interfaces';

class App extends React.Component<any, object> {

  packageBaseDir: string = '/Users/tedshaffer/Documents/bacon-comp/';
  packageNames: string[] = [];

  constructor(props: any){
    super(props);

    // specify packages
    this.packageNames.push('ba-context-model');
    this.packageNames.push('ba-schedule');
    this.packageNames.push('ba-uw-dm');
    this.packageNames.push('ba-uw-manager');
    this.packageNames.push('bacon-theme');
    this.packageNames.push('baconcore');
    this.packageNames.push('bpfimporter');
    this.packageNames.push('bs-content-manager');
    this.packageNames.push('bs-device-artifacts');
    this.packageNames.push('bs-playlist-dm');
    this.packageNames.push('bs-widgets');
    this.packageNames.push('bscore');
    this.packageNames.push('bsdatamodel');
    this.packageNames.push('bsdevicesetup');
    this.packageNames.push('bsn-ui-v2-ns');
    this.packageNames.push('bsnconnector');
    this.packageNames.push('bspublisher');
    this.packageNames.push('fsconnector');
    this.packageNames.push('fsmetadata');

    // this.configureButtonClicked = this.configureButtonClicked.bind(this);
  }

  componentDidMount() {

    // get version (version of published name package) of each package as specified in bacon's package.json
    const packageDotJsonVersionsMap: any = this.parseBaconPackageDotJson();

    // const bsPackages: BsPackage[] = [];
    //
    // this.packageNames.forEach((packageName) => {
    //
    //   console.log('Retrieving info for ', packageName);
    //
    //   const packagePath = this.packageBaseDir.concat(packageName);
    //
    //   shell.cd(packagePath);
    //   shell.pwd();
    //
    //   // perform git fetch on the branch so that all the tags are local
    //   const gitFetchCmd: string = shell.exec('git fetch').stdout;
    //   const bsTags: BsTag[] = this.getTags();
    //
    //   // get the branches for his package
    //   // this.getBranches();
    //
    //   const currentVersion = this.getPackageCurrentVersion(bsTags);
    //
    //   const bsPackage: BsPackage = {
    //     name: packageName,
    //     currentVersion,
    //     packageDotJsonSpecifiedPackage: packageDotJsonVersionsMap[packageName],   //  ever null? (causing a crash?)
    //     tags: bsTags,
    //     packageVersionSelector: PackageVersionSelectorType.Current,
    //     selectedTagIndex: 0,
    //     upgradeTagIndex: -1,
    //     selectedBranchName: 'master',
    //     specifiedCommitHash: '',
    //     versionComparison: PackageVersionComparisonType.VersionsEqual,
    //     defaultChanged: false,
    //   };
    //   bsPackages.push(bsPackage);
    //   this.props.addPackage(bsPackage);
    //
    //   // see if there's a tag in the list of tags that match what's in package.json
    //   const specifiedBsPackage = packageDotJsonVersionsMap[packageName];
    //   const specifiedBsPackageVersion = specifiedBsPackage.version;
    //   if (semver.valid(specifiedBsPackageVersion)) {
    //     bsTags.forEach((tag: BsTag, tagIndex) => {
    //       const tagName = tag.name;
    //
    //       if (semver.valid(tagName)) {
    //         if (semver.intersects(specifiedBsPackageVersion, tagName)) {
    //           // if a compatible package has already been found, use the higher numbered package
    //           if (!isNil(bsPackage.tagIndexForPackageDotJsonPackageVersion)) {
    //             const tagIndexForPackageDotJsonPackageVersion = bsPackage.tagIndexForPackageDotJsonPackageVersion;
    //             if (semver.gt(tagName, bsTags[tagIndexForPackageDotJsonPackageVersion].name)) {
    //               bsPackage.tagIndexForPackageDotJsonPackageVersion = tagIndex;
    //             }
    //           }
    //           else {
    //             bsPackage.tagIndexForPackageDotJsonPackageVersion = tagIndex;
    //           }
    //         }
    //       }
    //     });
    //   }
    //
    //   // determine status of package by comparing current vs. specified version
    //   if (currentVersion.charAt(0) === 'v') {
    //     if (semver.valid(currentVersion) && semver.valid(specifiedBsPackageVersion)) {
    //       if (semver.gt(currentVersion, specifiedBsPackageVersion)) {
    //         bsPackage.versionComparison = PackageVersionComparisonType.CurrentIsNewer;
    //       }
    //       else if (semver.lt(currentVersion, specifiedBsPackageVersion)) {
    //         bsPackage.versionComparison = PackageVersionComparisonType.SpecifiedIsNewer;
    //
    //         // find tag of specified version
    //         const tags = bsPackage.tags;
    //         tags.forEach( (tag, index) => {
    //           if (tag.name.substr(1) === bsPackage.packageDotJsonSpecifiedPackage.version) {
    //             bsPackage.upgradeTagIndex = index;
    //             bsPackage.packageVersionSelector = PackageVersionSelectorType.Tag;
    //             return;
    //           }
    //         });
    //
    //       }
    //       else {
    //         bsPackage.versionComparison = PackageVersionComparisonType.VersionsEqual;
    //       }
    //     }
    //   }
    //   else {
    //     bsPackage.versionComparison = PackageVersionComparisonType.CurrentNotTagged;
    //   }
    //   console.log(bsPackage);
    //
    //   // get the last n commits on the current branch for this package
    //   // currentBranch=$(git branch | grep \* | cut -d ' ' -f2)
    //   // let currentBranch: string = '';
    //   // const rawBranches: string = shell.exec('git branch').stdout;
    //   // const branches: string[] = rawBranches.split('\n');
    //   // branches.forEach((branchName) => {
    //   //   if (branchName.startsWith('* ')) {
    //   //     currentBranch = branchName.substring(2);
    //   //   }
    //   // });
    //   // console.log('currentBranch: ', currentBranch);
    //
    //   // git log -$numCommits
    //   // const numRecentCommits = 3;
    //   // const recentCommits: RecentCommitData[] = [];
    //   // for (let i = 0; i < (numRecentCommits - 1); i++) {
    //   //   const commitMessage = shell.exec('git log -1 --skip=' + i.toString()).stdout;
    //   //   const commitHash = this.getCommitHashFromCommitMessage(commitMessage);
    //   //   recentCommits.push( {
    //   //     commitHash,
    //   //     commitMessage
    //   //   });
    //   // }
    // });
  }

  // return the current version of the current package - either the tag name or the commit hash
  // getPackageCurrentVersion(bsTags: BsTag[]): string {
  //   let currentVersion: string = '';
  //   const commitMessage = shell.exec('git log -1').stdout;
  //   const commitHash = this.getCommitHashFromCommitMessage(commitMessage);
  //   bsTags.forEach( (tag, index) => {
  //     if (tag.commitHash === commitHash) {
  //       currentVersion = tag.name;
  //     }
  //   });
  //   if (currentVersion === '') {
  //     currentVersion = commitHash;
  //   }
  //
  //   return currentVersion;
  // }
  //
  // return a structure mapping a package name to an object that contains
  //    packageName
  //    the version (semver format) specified in package.json

  parseBaconPackageDotJson(): any {

    const packageDotJsonVersionsMap: any = {};
    const baconPackageJsonPath = this.packageBaseDir.concat('bacon/package.json');
    const baconPackageJson = fs.readJsonSync(baconPackageJsonPath);

    const baconPackage: BsPackage = {
      name: 'bacon',
      currentVersion: baconPackageJson.version
    };
    this.props.addPackage(baconPackage);

    for (const dependentPackageName in baconPackageJson.dependencies) {
      if (baconPackageJson.dependencies.hasOwnProperty(dependentPackageName)) {
        const packageVersionSpec: string = baconPackageJson.dependencies[dependentPackageName];
        this.props.addPackageDependency('bacon', dependentPackageName, packageVersionSpec);
      }
    }

    return packageDotJsonVersionsMap;
  }

  // getCommitHashFromCommitMessage(commitMessage: string) : string {
  //   return commitMessage.substr(7, 40);
  // }
  //
  // getTags() {
  //
  //   const rawTags: any = shell.exec('git tag');
  //
  //   const splitTags: string[] = rawTags.split('\n');
  //
  //   const tags: string[] = [];
  //   splitTags.forEach((tag) => {
  //     if (tag !== '' && semver.valid(tag)) {
  //       tags.push(tag);
  //     }
  //   });
  //
  //   // sort tags
  //   tags.sort(semver.rcompare);
  //
  //   const bsTags: BsTag[] = [];
  //
  //   tags.forEach((tag) => {
  //
  //     // get the commitMessage information for the tag
  //     // commitLine=$(git show $tag | grep commitMessage)
  //     const gitShowCmd: string = 'git show ' + tag + ' | grep commit'
  //     const commitLine: string = shell.exec(gitShowCmd).stdout;
  //     let commitHash: string = commitLine.split(' ')[1];
  //     if (commitHash.endsWith('\n')) {
  //       commitHash = commitHash.trim();
  //     }
  //
  //     // commitInfo = $(git log -1 $commitHash)
  //     const gitLogCmd: string = 'git log -1 ' + commitHash;
  //     const commitInfo: string = shell.exec(gitLogCmd).stdout;
  //
  //     bsTags.push( {
  //       name: tag,
  //       commitMessage: commitInfo,
  //       commitHash
  //     });
  //   });
  //
  //   return bsTags;
  // }
  //
  // getBranches() {
  //
  //   // Future implementation
  //
  //   // local or remote?
  //   const rawBranches: any = shell.exec('git branch -a');
  //   console.log(rawBranches.stdout);
  //
  // }
  //
  // // TODO - replace by selector
  // getBsPackageByName(packageName: string) : BsPackage {
  //   const bsPackagesByPackageName: any = this.props.bsPackages.bsPackagesByPackageName;
  //   for (const bsPackageName in bsPackagesByPackageName) {
  //     if (bsPackagesByPackageName.hasOwnProperty(bsPackageName)) {
  //       if (packageName === bsPackageName) {
  //         return bsPackagesByPackageName[packageName];
  //       }
  //     }
  //   }
  //   return null;
  // }
  //
  // markPackageDefaultOverriden(packageName: string) : void {
  //   const selectedPackage: BsPackage = this.getBsPackageByName(packageName);
  //   if (!isNil(selectedPackage)) {
  //     selectedPackage.upgradeTagIndex = -1;
  //     selectedPackage.defaultChanged = true;
  //   }
  // }
  //
  // setPackageVersionSelector(event: any, value: any) {
  //   console.log('setPackageVersionSelector invoked');
  //   const params: string[] = value.split(':');
  //   this.props.setPackageVersionSelector(params[0], params[1]);
  //   this.markPackageDefaultOverriden(params[0]);
  // }
  //
  // selectTag(event: any, key: number, payload: any) {
  //   console.log('selectTag invoked');
  //   const params: string[] = payload.split(':');
  //   this.props.setSelectedTagIndex(params[0], Number(params[1]));
  //   this.markPackageDefaultOverriden(params[0]);
  // }
  //
  // setBranchName(event: any, newValue: string) {
  //   console.log('setBranchName invoked');
  //   const params: string[] = event.target.id.split(':');
  //   const packageName: string = params[0];
  //   const branchName: string = newValue;
  //   this.props.setSelectedBranchName(packageName, branchName);
  //   this.markPackageDefaultOverriden(params[0]);
  // }
  //
  // setCommitHash(event: any, newValue: string) {
  //   console.log('setCommitHash invoked');
  //   const params: string[] = event.target.id.split(':');
  //   const packageName: string = params[0];
  //   const commitHash: string = newValue;
  //   this.props.setSpecifiedCommitHash(packageName, commitHash);
  //   this.markPackageDefaultOverriden(params[0]);
  // }
  //
  // configureButtonClicked() {
  //
  //   const bsPackagesByPackageName: any = this.props.bsPackages.bsPackagesByPackageName;
  //   for (const packageName in bsPackagesByPackageName) {
  //     if (bsPackagesByPackageName.hasOwnProperty(packageName)) {
  //       const bsPackage: BsPackage = bsPackagesByPackageName[packageName];
  //       console.log(bsPackage);
  //
  //       const packagePath = this.packageBaseDir.concat(bsPackage.name);
  //
  //       let checkoutSpecifier: string = '';
  //
  //       shell.cd(packagePath);
  //       shell.pwd();
  //
  //       switch (bsPackage.packageVersionSelector) {
  //         case PackageVersionSelectorType.Tag: {
  //           const tagIndex = bsPackage.upgradeTagIndex > 0 ? bsPackage.upgradeTagIndex : bsPackage.selectedTagIndex;
  //           const bsTag: BsTag = bsPackage.tags[tagIndex];
  //           checkoutSpecifier = this.getCommitHashFromCommitMessage(bsTag.commitMessage);
  //           console.log('commitMessage: ', checkoutSpecifier);
  //           break;
  //         }
  //         case PackageVersionSelectorType.Branch: {
  //           checkoutSpecifier = bsPackage.selectedBranchName;
  //           console.log('branchName: ', checkoutSpecifier);
  //           break;
  //         }
  //         case PackageVersionSelectorType.Commit: {
  //           checkoutSpecifier = bsPackage.specifiedCommitHash;
  //           console.log('commitMessage: ', checkoutSpecifier);
  //           break;
  //         }
  //         case PackageVersionSelectorType.PackageDotJsonVersion: {
  //           const packageVersion = bsPackage.packageDotJsonSpecifiedPackage.version;
  //           // find the tag, and therefore the commitMessage that corresponds to this version
  //           // fix me up
  //           bsPackage.tags.forEach( (bsTag) => {
  //             if (bsTag.name.substr(1) === packageVersion) {
  //               checkoutSpecifier = this.getCommitHashFromCommitMessage(bsTag.commitMessage);
  //               console.log('packageVersionSelector: ', checkoutSpecifier);
  //             }
  //           });
  //           break;
  //         }
  //         case PackageVersionSelectorType.Current: {
  //           // no change
  //           break;
  //         }
  //         default: {
  //           debugger;
  //         }
  //       }
  //
  //       if (checkoutSpecifier !== '') {
  //         const gitCheckoutOutput: shell.ExecOutputReturnValue = shell.exec('git checkout ' + checkoutSpecifier);
  //
  //         console.log('gitCheckout results for: ', bsPackage.name);
  //         if (gitCheckoutOutput.stderr !== '') {
  //           console.log('STDERR');
  //           console.log(gitCheckoutOutput.stderr);
  //
  //           if (gitCheckoutOutput.stderr.startsWith('error:')) {
  //             alert(bsPackage.name + '\n\n' + gitCheckoutOutput.stderr);
  //             return;
  //           }
  //         }
  //         else {
  //           console.log(gitCheckoutOutput.stdout);
  //         }
  //       }
  //     }
  //   }
  // }
  //
  // buildTagOption(tag: BsTag, bsPackageName: string, tagIndex: number) {
  //
  //   return (
  //     <MenuItem key={tag.name} value={bsPackageName + ':' + tagIndex.toString()} primaryText={tag.name}/>
  //   );
  // }
  //
  // buildTagOptions(bsPackage: BsPackage) {
  //
  //   const tagOptions: any[] = [];
  //
  //   bsPackage.tags.forEach((tag, index) => {
  //     const tagOption: any = this.buildTagOption(tag, bsPackage.name, index);
  //     tagOptions.push(tagOption);
  //   });
  //
  //   return tagOptions;
  // }
  //
  // buildPackageRow(bsPackage: BsPackage) {
  //
  //   const tagOptions: any = this.buildTagOptions(bsPackage);
  //
  //   const self: any = this;
  //
  //   let tagValue = bsPackage.name + ':' + bsPackage.selectedTagIndex.toString();
  //
  //   let comparisonColor: string = 'black';
  //   let statusColor: string = 'black';
  //   let status: string = '';
  //
  //   let defaultSelectedPackage = bsPackage.name + ':' + (bsPackage.upgradeTagIndex < 0 ?
  //     PackageVersionSelectorType.Current : PackageVersionSelectorType.Tag);
  //
  //   switch (bsPackage.versionComparison) {
  //     case PackageVersionComparisonType.VersionsEqual: {
  //       comparisonColor = 'green';
  //       status = 'No action required';
  //       break;
  //     }
  //     case PackageVersionComparisonType.CurrentIsNewer: {
  //       comparisonColor = 'gold';
  //       status = 'Current version newer';
  //       break;
  //     }
  //     default:
  //     case PackageVersionComparisonType.CurrentNotTagged:
  //     case PackageVersionComparisonType.SpecifiedIsNewer: {
  //       comparisonColor = 'red';
  //
  //       // find tag of specified version
  //       let matchingTagFound = false;
  //       const tags = bsPackage.tags;
  //       tags.forEach( (tag, index) => {
  //         const tagName = tag.name;
  //         if (tagName.substr(1) === bsPackage.packageDotJsonSpecifiedPackage.version) {
  //           tagValue = bsPackage.name + ':' + index.toString();
  //           defaultSelectedPackage = bsPackage.name + ':' + PackageVersionSelectorType.Tag;
  //           status = 'Update selected';
  //           statusColor = 'green';
  //           matchingTagFound = true;
  //           return;
  //         }
  //       });
  //       if (!matchingTagFound) {
  //         status = '** Caution **';
  //         statusColor = 'red';
  //       }
  //       break;
  //     }
  //   }
  //
  //   if (bsPackage.defaultChanged) {
  //     status = '** default overridden';
  //     statusColor = 'orange';
  //   }
  //
  //   return (
  //     <TableRow key={bsPackage.name}>
  //       <TableRowColumn
  //         style={{
  //           color: comparisonColor,
  //         }}>
  //         {bsPackage.name}
  //       </TableRowColumn>
  //       <TableRowColumn
  //         style={{
  //           color: statusColor,
  //         }}>
  //         {status}
  //       </TableRowColumn>
  //       <TableRowColumn>
  //         {bsPackage.currentVersion}
  //       </TableRowColumn>
  //       <TableRowColumn>
  //         {bsPackage.packageDotJsonSpecifiedPackage.version}
  //       </TableRowColumn>
  //       <TableRowColumn>
  //         <RadioButtonGroup
  //           name='packageIdType'
  //           defaultSelected={defaultSelectedPackage}
  //           onChange={self.setPackageVersionSelector}
  //         >
  //           <RadioButton
  //             value={bsPackage.name + ':' + PackageVersionSelectorType.Current}
  //             label='Current'
  //           />
  //           <RadioButton
  //             value={bsPackage.name + ':' + PackageVersionSelectorType.Tag}
  //             label='Tag'
  //           />
  //           <RadioButton
  //             value={bsPackage.name + ':' + PackageVersionSelectorType.Commit}
  //             label='Commit'
  //           />
  //           <RadioButton
  //             value={bsPackage.name + ':' + PackageVersionSelectorType.Branch}
  //             label='Branch'
  //           />
  //         </RadioButtonGroup>
  //       </TableRowColumn>
  //       <TableRowColumn>
  //         <SelectField
  //           floatingLabelText='Tag'
  //           value={tagValue}
  //           onChange={self.selectTag}
  //         >
  //           {tagOptions}
  //         </SelectField>
  //       </TableRowColumn>
  //       <TableRowColumn>
  //         <TextField
  //           id={bsPackage.name + ':commitHash'}
  //           defaultValue=''
  //           onChange={self.setCommitHash}
  //         />
  //       </TableRowColumn>
  //       <TableRowColumn>
  //         <TextField
  //           id={bsPackage.name + ':branchName'}
  //           defaultValue='master'
  //           onChange={self.setBranchName}
  //         />
  //       </TableRowColumn>
  //     </TableRow>
  //   );
  // }
  //
  // buildPackageRows() {
  //
  //   const bsPackageRows: any = [];
  //
  //   const bsPackagesByPackageName: any = this.props.bsPackages.bsPackagesByPackageName;
  //   for (const packageName in bsPackagesByPackageName) {
  //     if (bsPackagesByPackageName.hasOwnProperty(packageName)) {
  //       const bsPackage: BsPackage = bsPackagesByPackageName[packageName];
  //       bsPackageRows.push(this.buildPackageRow(bsPackage));
  //     }
  //   }
  //
  //   return bsPackageRows;
  // }

// <TableHeaderColumn>Tag Commit</TableHeaderColumn>
  render() {

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
  };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return bindActionCreators({
    addPackage,
    addPackageDependency,
    // setPackageVersionSelector,
    // setSelectedBranchName,
    // setSelectedTagIndex,
    // setSpecifiedCommitHash,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

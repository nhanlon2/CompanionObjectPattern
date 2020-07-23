
enum BucketEncryption {
    UNENCRYPTED = "NONE",
    KMS_MANAGED = "MANAGED",
    S3_MANAGED = "S3MANAGED",
    KMS = "KMS"
}

class LifecycleRule {

}

export interface RoSBucketProps {
    readonly bucketName: string;
    readonly bucketEncryption: BucketEncryption;
    readonly putBucketEncryption: string;
    readonly versioned: boolean;
}

const ROS_TYPE1_BUCKETNAME = ['ros-type1-dev', 'ros-type1-test', 'ros-type1-prod'] as const;
type ROS_TYPE1_BUCKETNAME = typeof ROS_TYPE1_BUCKETNAME[number];

const ROS_TYPE2_BUCKETNAME = ['ros-type2-dev', 'ros-type2-test', 'ros-tyep2-prod'] as const;
type ROS_TYPE2_BUCKETNAME = typeof ROS_TYPE2_BUCKETNAME[number];

const ROS_TYPE3_BUCKETNAME = ['ros-type3'] as const;
type ROS_TYPE3_BUCKETNAME = typeof ROS_TYPE3_BUCKETNAME[number];

const ROS_TYPE4_BUCKETNAME = ['ros-type4'] as const;
type ROS_TYPE4_BUCKETNAME = typeof ROS_TYPE4_BUCKETNAME[number];
type ROS_BUCKETNAME = ROS_TYPE1_BUCKETNAME | ROS_TYPE2_BUCKETNAME | ROS_TYPE3_BUCKETNAME | ROS_TYPE4_BUCKETNAME;

type KMS_ENCRYPTION = 'aws: kms';
const KMS_ENCRYPTION: KMS_ENCRYPTION = 'aws: kms';
type AES_ENCRYPTION = 'AES256';
const AES_ENCRYPTION: AES_ENCRYPTION = 'AES256';

type RosLifeCycleRules = {
    readonly lifecycleRules?: LifecycleRule[];
}
type RosVersionedProps = {
    readonly versioned: true
}
const RosVersionedProps: RosVersionedProps = {
    versioned: true
}
const RosVersionedProps2 = {
    versioned: true
}
//RosVersionedProps.versioned = false; compiler error!
RosVersionedProps2.versioned = false;
type RosUnVersionedProps = {
    readonly versioned: false
}
const RosUnVersionedProps: RosUnVersionedProps = {
    versioned: false
}

type RosKMSManagedProps = {
    readonly bucketEncryption: BucketEncryption.KMS_MANAGED,
    readonly putBucketEncryption: KMS_ENCRYPTION
}
const RosKMSManagedProps: RosKMSManagedProps = {
    bucketEncryption: BucketEncryption.KMS_MANAGED,
    putBucketEncryption: KMS_ENCRYPTION
}

type RosAESManagedProps = {
    readonly bucketEncryption: BucketEncryption.S3_MANAGED,
    readonly putBucketEncryption: AES_ENCRYPTION
}
const RosAESManagedProps: RosAESManagedProps = {
    bucketEncryption: BucketEncryption.S3_MANAGED,
    putBucketEncryption: AES_ENCRYPTION
}

type RoSVersionedKMSManagedProps = RosVersionedProps & RosKMSManagedProps;
const RoSVersionedKMSManagedProps: RoSVersionedKMSManagedProps = { ...RosVersionedProps, ...RosKMSManagedProps };
type RoSUnVersionedAESManagedProps = RosUnVersionedProps & RosAESManagedProps;
const RoSUnVersionedAESManagedProps: RoSUnVersionedAESManagedProps = { ...RosUnVersionedProps, ...RosAESManagedProps };

export type RoSType1Buckets = RoSVersionedKMSManagedProps & RosLifeCycleRules & {
    readonly bucketName: ROS_TYPE1_BUCKETNAME
}

export type RosType2Buckets = RoSVersionedKMSManagedProps & RosLifeCycleRules & {
    readonly bucketName: ROS_TYPE2_BUCKETNAME
}

export type RosType3Buckets = RoSUnVersionedAESManagedProps & RosLifeCycleRules & {
    readonly bucketName: ROS_TYPE3_BUCKETNAME
}

export type RosType4Buckets = RoSUnVersionedAESManagedProps & RosLifeCycleRules & {
    readonly bucketName: ROS_TYPE4_BUCKETNAME
}


function createBucketProps(bucketName: ROS_BUCKETNAME): RoSBucketProps {
    if (isRosType1BucketName(bucketName)) {
        const props: RoSType1Buckets = { ...RoSVersionedKMSManagedProps, ...{ bucketName: bucketName } };
        return props;
    } else if (isRosType2BucketName(bucketName)) {
        const props: RosType2Buckets = { ...RoSVersionedKMSManagedProps, ...{ bucketName: bucketName  } };
        return props;
    } else if (isRosType3BucketName(bucketName)) {
        const props: RosType3Buckets = { ...RoSUnVersionedAESManagedProps, ...{bucketName: bucketName} };
        return props;
    } else  {
        const props: RosType4Buckets = { ...RoSUnVersionedAESManagedProps, ...{ lifecycleRules: [] }, ...{ bucketName: bucketName} };
        return props;
    }

}
console.log(createBucketProps("ros-type1-dev"));
function isRosType1BucketName(bucketName: ROS_BUCKETNAME): bucketName is ROS_TYPE1_BUCKETNAME {
    return ROS_TYPE1_BUCKETNAME.indexOf(bucketName as ROS_TYPE1_BUCKETNAME) > -1;
}
function isRosType2BucketName(bucketName: ROS_BUCKETNAME): bucketName is ROS_TYPE2_BUCKETNAME {
    return ROS_TYPE2_BUCKETNAME.indexOf(bucketName as ROS_TYPE2_BUCKETNAME) > -1;
}

function isRosType3BucketName(bucketName: ROS_BUCKETNAME): bucketName is ROS_TYPE3_BUCKETNAME {
    return ROS_TYPE3_BUCKETNAME.indexOf(bucketName as ROS_TYPE3_BUCKETNAME) > -1;
}

function isRosType4BuketName(bucketName: ROS_BUCKETNAME): bucketName is ROS_TYPE4_BUCKETNAME {
    return ROS_TYPE4_BUCKETNAME.indexOf(bucketName as ROS_TYPE4_BUCKETNAME) > -1;
}

const devBucketStackProps: RoSBucketProps[] = [createBucketProps('ros-type1-dev'), createBucketProps('ros-type2-dev')];

const testBucketStackProps = [createBucketProps('ros-type1-test'), createBucketProps('ros-type2-test')];


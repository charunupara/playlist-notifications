const cdk = require('aws-cdk-lib');

const { aws_dynamodb: dynamodb } = cdk;

class PlaylistNotificationsStack extends cdk.Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const accessTokenTable = new dynamodb.TableV2(this, 'AccessTokenTable', {
      partitionKey: { name: 'userID', type: dynamodb.AttributeType.STRING },
    });
    
  }
}

module.exports = { PlaylistNotificationsStack }

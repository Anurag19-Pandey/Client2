import S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';
// import { DeleteObjectCommand } from '@aws-sdk/client-s3';
// import { loadingActions } from '../redux/actions/loading.action';
// import store from '../redux/store';
// import { get } from './Remote';
import axios from 'axios' ;

export const uploadingImage = (file, nameAndId, userId) => {
  const { name } = file;
  // let extention = name.split('.').pop();
  // if (extention.length > 4) {
  //   extention = 'others';
  // }
  // const newName = name.split('.')[0] + Date.now();
  // let finalName = `${uuidv4()}.${name.split('.').pop()}`;
  // if (customName == 'sa') {
  //   finalName = customName;
  //   extention = '';
  // }

  const finalName = uuidv4();
  return new Promise((resolve, rej) => {
    axios.get(`${process.env.REACT_APP_SERVER_PROD}/api/getAwsCredentialsWithBucketConfiguration`).then((res) => {
      
      const { result } = res.data;
     
      const bucket = new S3({
        params: {
          Bucket: window.location.href.includes('app.10point.ai')
            ? `${result.bucket_name}/profile/${userId}/${nameAndId}`
            : `${result.bucket_name}/profile/Dev/${userId}/${nameAndId}`,
        },
        accessKeyId: result.key,
        secretAccessKey: result.secret,
        region: result.region,
      });
      
      const params = { Key: finalName, ContentType: file.type, Body: file };
      // console.log(params, 'file uploaaaaaaaaaaaaaaaaad');
    //   store.dispatch(loadingActions.pending());
      bucket
        .upload(params)
        // .on('httpUploadProgress', (evt) => {
        //   store.dispatch(
        //     loadingActions.setAmountLoadedToStore(Math.floor((evt.loaded * 100) / evt.total)),
        //   );
          // store.dispatch(loadingActions.setTotalLoadedToStore(100));
          //     console.log('Progress:', evt.loaded, '/', evt.total);
        // })
        .send((err, data) => {
          console.log(err, data);
          const obj = {};
          obj.filename = changeUrlFromS3ToCloudfront(data.Location);
        //   store.dispatch(loadingActions.success());
          resolve(obj);
        });
    });
  });
};

const changeUrlFromS3ToCloudfront = (url) => {
  const newUrl = url.replace(
    'https://s3.ap-south-1.amazonaws.com/10point.ai',
    'https://d8gmx7v1fm5o4.cloudfront.net',
  );

  return newUrl;
};

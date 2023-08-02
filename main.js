let isConfigUpdate = false;
let reader = new FileReader();




async function uploadToS3Bucket(file_name,email_file_name, stream, stream1, credential, cd) {
    try {
        if (!window.AWS) {
            return
        }
        if (!isConfigUpdate) {
            window.AWS.config.update(({ region: credential.region }));
            isConfigUpdate = true;
        }

        let s3 = new window.AWS.S3({
            credentials: new window.AWS.Credentials({
                apiVersion: 'latest',
                accessKeyId: credential.accressKeyId,
                secretAccessKey: credential.secretAccessKey,
                signatureVersion: credential.signatureVersion,
                region: credential.region,
                Bucket: credential.Bucket
            })
        });
        // console.log(s3)
        let uploadItem = await s3.upload({
            Bucket: credential.Bucket,
            Key: file_name,// name for the bucket file
            ContentType: document.getElementById("file").files[0].type,
            Body: stream
        }).on("httpUploadProgress", function (progress) {
            console.log("progress=>", progress)
            cd(getUploadingProgress(progress.loaded, progress.total));
        }).promise();

        let uploadItem1 = await s3.upload({
            Bucket: credential.Bucket,
            Key: email_file_name,// name for the bucket file
            ContentType: document.getElementById("email").files[0].type,
            Body: stream1
        }).on("httpUploadProgress", function (progress) {
            console.log("progress=>", progress)
            cd(getUploadingProgress(progress.loaded, progress.total));
        }).promise();

        console.log("uploadItem=>", uploadItem)
        return uploadItem;
    }
    catch (error) {
        console.log(error)
    }

}

function getUploadingProgress(uploadSize, totalSize) {
    let uploadProgress = (uploadSize / totalSize) * 100;
    return Number(uploadProgress.toFixed(0));
}

async function uploadMedia() {
    let credentialRequest = {
        accressKeyId: 'AKIA3PQB3ZMWI7LZLCFZ',
        secretAccessKey: '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',
        signatureVersion: 'v4',
        region: 'eu-north-1',
        Bucket: 'vgetgbrhegrwsdc'
        // Bucket: 'haridemobucket'
    };
    // console.log(credentialRequest)
    let mediaStreamRequest = getFile(document.getElementById("file").files[0])
    file_name = document.getElementById('file').files[0].name;
    file_name = file_name.split(".")[0]
    const [mediaStream] = await Promise.all([
        mediaStreamRequest
    ])

    let mediaStreamRequest1 = getFile(document.getElementById("email").files[0])
    email_file_name = document.getElementById('email').files[0].name;
    email_file_name = email_file_name.split(".")[0]
    const [mediaStream1] = await Promise.all([
        mediaStreamRequest1
    ])


    await uploadToS3Bucket(file_name,email_file_name, mediaStream, mediaStream1, credentialRequest, (progress) => {
        console.log(progress)
    })
}

async function getFile(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.onerror = (err) => {
            reject(false);
        };
        reader.readAsArrayBuffer(file);
    });
};














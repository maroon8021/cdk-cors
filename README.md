# CORS check

## 概要

以下の CORS に関する内容を確認したかった

- CORS でこけないようにするために、どこを設定するとよいか
- cdk 上どうやってかけばよいか
- backend 側でもなにか必要なのか

## 結論

- API-Gateway 側の設定が必要
- backend 側の設定も必要

### API-Gateway 側の設定が必要

`defaultCorsPreflightOptions` の設定が必要そう
https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-apigateway.LambdaRestApi.html#defaultcorspreflightoptions

https://github.com/aws/aws-cdk/blob/0f06223180d98dca6f56e49402964ec4d181ec13/packages/%40aws-cdk/aws-apigateway/README.md#cross-origin-resource-sharing-cors

ここを設定しないと `Preflight` でコケる

### backend 側の設定も必要

`Preflight` で通過しても backend 側(からのレスポンス)にも `Access-Control-Allow-Origin` の情報がのってないと、結局許可なくて怒られる
※最後レスポンスの header に `Access-Control-Allow-Origin` が含まれていたらよいはずなので、これ backend じゃなくて api-gateway 側でもよいのでは？とか思ったが、メンテナンス性とかも考えて、このあたりは application 側で管理してもよい気がしている

記載する必要のある headers  
https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/how-to-cors.html#apigateway-responding-to-cors-preflight

## 余談

久しぶりに素の nodejs で lambda 書いたら、api-gateway で以下の理由で怒られた
https://aws.amazon.com/jp/premiumsupport/knowledge-center/malformed-502-api-gateway/

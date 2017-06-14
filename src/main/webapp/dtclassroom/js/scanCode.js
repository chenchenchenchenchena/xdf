<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="black" />
		<meta name="format-detection" content="telephone=no" />
		<meta name="full-screen" content="yes"/>
		<title>扫码</title>
		<link rel="stylesheet" href="css/Scan.css">
		<link rel="stylesheet" href="../common/css/base.css"  />
	</head>
	<body>
		<div class="Scan-s sucs"  style="display:none">
			<img src="images/sys.png" alt=""  id="scanQRCode">
			<i>请点击图片进行扫一扫</i>
		</div>
		<div class="Scan-s erro" style="display:none">
			<img src="images/ere.png" alt="">
			<i>登录失败,请重新登录!</i>
		</div>
		<input type="text" style="display:none;" class="Wxid">
		<script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
		<script src="../common/js/zepto.min.js"></script>
		<script src="../common/js/rem.js"></script>
		<script src="js/scanCode.js"></script>
	</body>
</html>

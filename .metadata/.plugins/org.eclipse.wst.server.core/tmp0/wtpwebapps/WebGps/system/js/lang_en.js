function langEnglish(){
	this.chinese = "Chinese";
	this.english = "English";
	this.russian = "russian";
	this.msgTitle = "Information";
	this.sysTitle = "GPS Vehicle Management Back-Office Systems";
	this.login = "Login";
	this.IDNO = "IDNO.";
	this.operator = "Operator";
	this.status = "Status";
	this.online = "Online";
	this.offline = "Offline";
	this.search = "Search";
	this.searchDevice = "Search";
	this.searchClient = "Search";
	this.save = "Save";
	this.all = "All";
	this.view = "View";
	this.more = "More";
	this.saving = "Saving ...";
	this.importing = "Importing ...";
	this.addok = "Added successfully!";
	this.saveok = "Saved successfully!";
	this.importok = "Import successfully!";
	this.deleteok = "Deleted successfully!";
	this.loading = "Loading ...";
	this.deleting = "Executing delete ...";
	this.index = "Index";
	this.selectAll = "All";
	this.query = "Query";
	this.begintime = "Begin Time";
	this.endtime = "End Time";
	this.labelBegintime = "Begin Time:";
	this.labelEndtime = "End Time:";
	this.content = "Content";
	this.time = "Time";
	this.username = "User Name";
	this.server = "Server";
	this.prevPage = "Prev Page";
	this.nextPage = "Next Page";
	this.total = "Total";
	this.page = "Page";
	this.record = "Record";
	this.current = "Current";
	this.go = "Go";
	this.hasReachedHome = "Has reached the first page!";
	this.hasReachedEnd = "Has reached the last page!";
	this.pageOverRange = "Jump Page has more than the total number of pages!";
	this.pageZoneUnvalid = "Jump page number not less than 1!";
	this.add = "Add";
	this.edit = "Edit";
	this.del = "Delete";
	this.addSel = "Add Select";
	this.delSel = "Delete Select";
	this.adding = "Adding ...";
	this.addSuc = "Add Successfully";
	this.delconfirm = "Data could not be restored if deleted, continue or not?";
	this.terminalMobile = "Mobile";
	this.terminalVehicle = "MDVR";
	this.terminalDvr = "DVS";
	this.terminalPad = "Pad";
	this.yes = "Yes";
	this.no = "No";
	
	//登录页面
	this.login_usrLogin = "User Login";
	this.login_UserName = "Account";
	this.login_Password = "Password";
	this.login_FlashVerifycode = "Click the picture to refresh the verification code";
	this.login_UserNameEmpty = "User name can't be empty!";
	this.login_VerifycodeEmpty = "Verification code can not be empty!";
	this.login_VerifycodeLength = "Verification code length less than 4!";
	this.login_InputUserName = "User Name";	
	this.login_logining = "Logging in, please wait ...";
	//主页
	this.home_welcome = "Welcome!";
	this.home_title = "Vehicle Network Management System";
	this.home_config = "Setup";
	this.home_exit = "Exit";
	this.home_roleAdmin = "Manager";
	this.home_roleUser = "User";
	this.home_navHome ="Home";
	this.home_navDevice ="Device";
	this.home_navClient ="Client";
	this.home_navStatus ="Status";
	this.home_navServer ="Server";
	this.home_navLog ="Log";
	this.home_navAdAndNews ="Ad and News";
	this.home_searchDevice = "Device Name Or IDNO";
	this.home_searchClient = "Client Name Or Account";
	this.home_searchDevIdno = "Device IDNO";
	this.home_exitTip = "Logout...";
	//修改密码
	this.home_changePassword = "Password";
	this.home_lablePwd = "Old Password:";
	this.home_lableNew = "New Password:";
	this.home_lableConfirmPwd = "Confirm Password:";
	this.home_errConfirmPwd = "Inconsistent with the new";
	this.home_changeAccount = "My Account";
	//
	this.home_statDevice = "Device Information";
	this.home_deviceManageCount = "Management total:";
	this.home_deviceTotalCount = "Device Count:";
	this.home_deviceStoreCount = "Inventory Count:";
	this.home_deviceOnlineCount = "Online Count:";
	
	this.home_statClient = "Client Information";
	this.home_clientTotalCount = "Client Count:";
	this.home_clientUserCount = "User Count:";
	this.home_clientOnlineCount = "Online Count:";
	
	this.home_statServer = "Server Information";
	this.home_serverLogin = "Login Server:";
	this.home_serverCount = "Server Count:";
	this.home_serverOnlineCount = "Online Count:";
	
	//-------------------------------设备管理-------------------------------/
	this.device_title = "Device Manager";
	this.device_all = "All Device";
	this.device_store = "Inventory Device";
	this.device_7dayexpire = "7 Days Arrears";
	this.device_30dayexpire = "30 Days Arrears";
	this.device_expire = "Arrears Device";
	this.device_batchadd = "Batch Add";
	this.device_delSelDevice = "Del Selected";
	this.device_saleSelDevice = "Sale Selected";
	this.device_name = "Name";
	this.device_type = "Device";
	this.device_chnCount = "Channel";
	this.device_simCard = "SIM Card";
	this.device_dateProduct = "Date Manufacture";
	this.device_client = "Client";
	this.device_add = "Add Device";
	this.device_edit = "Edit Device";
	this.device_sale = "Sale Device";
	this.device_batchadd = "Batch Add";
	this.device_batchaddTitle = "Batch Add Device";
	this.device_unregAddTitle = "Add Unregister Device";
	this.device_labelName = "Name:";
	this.device_labelIDNO = "IDNO.:";
	this.device_labelDevType = "Teminal:";
	this.device_labelChnCount = "Channel:";
	this.device_labelSimCard = "SIM Card:";
	this.device_labelDateProduct = "Product:";
	this.device_labelBatchCount = "Count:";
	this.device_errChnCount = "Range 0-12";
	this.device_errBatchCount = "Range 2-200";
	this.device_errSimCardRegx = "Must be numbers between 1-32 characters";
	this.device_batchTip = "Accordance with the number incremented!";
	this.device_lableSale = "Sale To:";
	this.device_saleTitle = "Sale Device";
	this.device_saleok = "Sale successfully";
	this.device_selectclient = "Please select client";
	this.device_sale = "Customer";
	this.device_resale = "Resale";
	this.device_errSelectClient = "Please select client";
	this.device_labelOwner = "Owner:";
	this.device_labelDevList = "Device Lists:";
	this.device_exportVehicleExcel = "Export Vehicle To Excel";
	this.device_exportMobileExcel = "Export Mobile To Excel";
	this.device_importExcel = "Import Form Excel";
	this.device_labelImportType = "Import Type:";
	this.device_labelImportExcel = "Select Excel File:";
	this.device_tipSelectExcelFile = "Please select excel file(*.xls)！";
	this.device_labelVeicleFormat = "MDVR Format:";
	this.device_labelMobileFormat = "Mobile Format:";
	this.device_veicleFormat = "Index, Vehicle, IDNO., Channel, SIM, Driver Name, Driver Phone, Brand, Type (Second line data)";
	this.device_mobileFormat = "Index, Name, Account, Telephone, Post, Identity Card, Address, Remarks";
	this.device_importFailed = "Part of the data import is unsuccessful!";
	this.device_selectAddress2 = "Use WAN Address(Device)2";
	this.device_selectPayment = "Enable Payment";
	this.device_labelPayBegin = "Contract Start:";
	this.device_labelPayPeriod = "Contract Period:";
	this.device_labelPayEnd = "Contract End:";
	this.device_pay6month = "6 Months";
	this.device_pay12month = "12 Months";
	this.device_pay18month = "18 Months";
	this.device_pay24month = "24 Months";
	this.device_labelPayDelay = "Grace Days:";
	this.device_labelPayStatus = "Contract Status:";
	this.device_labelPayMonth = "Months Paid:";
	this.device_labelPayOverDay = "Arrears Days:";
	this.device_labelStoDay = "Storage Days：";
	this.device_payStatusNormal = "Normal";
	this.device_payStatusAbnormal = "Arrears ";
	this.device_errPayMonth = "0 - 24 Months";
	this.device_errPayDelay = "0 - 14 Days";
	this.device_payBegin = "Contract Start";
	this.device_payMonth = "Months Paid";
	this.device_payPeriod = "Contract";
	this.device_payStatus = "Contract Status";
	this.device_payOverDay = "Arrears Days";
	this.device_payEnable = "Enable Payment";
	this.device_exportExcel = "Export to Excel";
	
	//-------------------------------用户信息管理-----------------------------/
	this.client_title = "Client Management";
	this.client_labelClientCount = "Client Count:";
	this.client_add = "Add Client";
	this.client_edit = "Edit Client";
	this.client_name = "Name";
	this.client_account = "Account";
	this.client_linkman = "Contact";
	this.client_telephone = "Telephone";
	this.client_email = "E-Mail";
	this.client_url = "Url";
	this.client_labelName = "Name:";
	this.client_labelAccount = "Account:";
	this.client_labelLinkman = "Contact:";
	this.client_labelTelephone = "Telephone:";
	this.client_labelEmail = "E-Mail:";
	this.client_labelAddress = "Address:";
	this.client_labelUrl = "Url:";
	this.client_viewTitle = "View Client";
	this.client_deviceList = "Devices List";
	this.client_clientList = "Users List";
	this.client_deviceCount = "Devices Total:";
	this.client_userCount = "Users Total:";
	this.client_resetPwd = "Reset Password";
	this.client_resetPwdIng = "Reset Password ....";
	this.client_defaultPwdtip = "Default Password:";
	this.client_operatorTip = "Client is the corporate administrator account, each client has a separate terminal and user information. Login WEB system, add sub-users.";
	
	//-------------------------------在线状态信息-------------------------------/
	this.status_title = "Online Status";
	this.status_device = "Online Device";
	this.status_client = "Online Client";
	this.status_unreg = "Unregister Device";
	this.status_labelDeviceCount = "Online Device Number:";
	this.status_labelUnregCount = "Unregister Device Number:";
	this.status_deviceJingWei = "Longitude/Latitude";
	this.status_deviceGpsTime = "GPS Time";
	this.status_address = "Address";
	this.status_network = "Network";
	this.status_deviceGWaySvr = "Gateway Server";
	this.status_labelClientCount = "Online Client Number:";
	this.status_clientLoginTime = "Login Time";
	this.status_clientType = "Type";
	this.status_clientOwner = "Client";
	this.status_clientUserSvr = "User Server";
	this.status_clientWindow = "C Client";
	this.status_clientWeb = "Web Client";
	this.status_clientIphone = "iPhone Client";
	this.status_show_position = "Map Position";
	this.status_deviceProtocol = "Protocol";
	this.status_deviceAudioCodec = "Audio Codec";
	this.status_deviceDiskType = "Storage";
	
	//-------------------------------服务器管理-------------------------------/
	this.server_login = "Login Server";
	this.server_gateway = "Gateway Server";
	this.server_media = "Media Server";
	this.server_user = "User Server";
	this.server_storage = "Storage Server";
	this.server_total = "Total";
	this.server_count = "Count";
	this.server_labelStatus = "Status:";
	this.server_labelName = "Name:";
	this.server_labelIDNO = "IDNO.:";
	this.server_labelLANAddr = "LAN Address:";
	this.server_labelWLANDevice = "WAN Address(Device)1:";
	this.server_labelWLANDevice2 = "WAN Address(Device)2:";
	this.server_labelWifiDevice ="Wifi Address(Device):";
	this.server_labelPortDevice = "WAN Port(Device):";
	this.server_labelWLANClient = "WAN Address(Client)1:";
	this.server_labelWLANClient2 = "WAN Address(Client)2:";
	this.server_labelPortClient = "WAN Port(Client):";
	this.server_errIPAddress = "IP is Invalid!";
	this.server_errPort = "Range: 0-65535";
	this.server_errPortEqual = "Must't be same with WAN Port(Device)";
	this.server_name = "Name";
	this.server_lanip = "Lan";
	this.server_wifiDevice ="Wifi Address(Device)";
	this.server_deviceIp = "WAN(Device)1";
	this.server_deviceIp2 = "WAN(Device)2";
	this.server_devicePort = "Port(Device)";
	this.server_clientIp = "WAN(Client)1";
	this.server_clientIp2 = "WAN(Client)2";
	this.server_clientPort = "Port(Client)";
	this.server_add = "Add Server";
	this.server_edit = "Edit Server";
	this.server_downStation = "Download Site";
	this.server_down = "Download Server";
	this.server_stationPosition = "Position";
	this.server_stationSsid = "SSID";
	this.server_stationType = "Distinction Way";
	this.server_stationByPosition = "Location";
	this.server_stationBySsid = "SSID Name";
	this.server_addStation = "Add Download Site";
	this.server_stationEdit = "Edit Download Site";
	this.server_labelSsid = "SSID:";
	this.server_labelIp = "IP：";
	this.server_stationTip = "SSID name to distinguish the download site, you must ensure that the ssid name of the uniqueness of the site";
	this.server_selectStationTip = "Choose a download site";
	this.server_downStationNullTip = "Download site does not exist, add the download site after the operation!";
	this.server_labelDownStation = "Download Site：";
	this.server_addStorageRelation = "Add Storage Associated";
	this.server_editStorageRelation = "Edit Storage Associated";
	this.server_stoRelationTip = "Tip: Please configure the storage associated first";
	this.server_labelStoServer = "Current Storage Server:";
	this.server_labelStoRelationCount = "Associated Number:";
	this.server_relation = "Associated";
	this.server_tipServerAddress2 = "Usually, address 1 and 2 will be consistent!";
	this.server_offlineTimeoutError = "Range: 30-1800 Second";
	this.server_labelOfflineTimeout = "Device Offline(S):"
	
	//-------------------------------系统用户日志查询-------------------------------/
	this.log_queryTitle = "Log Query";
	this.log_querySysUsr = "System Users Log";
	this.log_queryServer = "Server Log";
	
	//-------------------------------广告消息管理-------------------------------/
	this.adAndNews_title = "AdAndNews";
	this.adAndNews_ad = "Ad";
	this.adAndNews_news = "News";
	this.adAndNews_delSelAdOrNews = "Del Selected";
	this.adAndNews_nameTitle = "Name";
	this.adAndNews_releaseDate = "ReleaseDate";
	this.adAndNews_validity = "Validity";
	this.ad_validity = "Validity:";
	this.ad_add = "Add Ad";
	this.news_add = "Add News";
	this.ad_edit = "Edit Ad";
	this.news_edit = "Edit News";
	this.ad_title = "Title:";
	this.ad_content = "Content:";
	this.addPicture = "Add Picture:";
	this.errTitleRegex = "Must't be more than 100 characters";
	this.errNewsTitleRegex = "Must't be more than 100 characters";
	this.errNewsContentRegex = "Must't be more than 300 characters";
	this.errAdContentRegex = "Must't be more than 1000 characters";
	this.adAndNews_errValidity = "Range 1-1000 days the number of days";
	this.errPicture = "Please select a picture";
	this.selectedImg = "Select Picture";
	this.pictureSize = "(Suggested that picture resolution 1280 * 800,Size does not exceed 1M,Gif format only supports dynamic picture)";
	
	//-------------------------------错误代码定义-------------------------------/
	//登录部分错误代码
	this.errLogin_UserNoExist = "The user name does not exist!";
	this.errLogin_PasswordError = "Password is incorrect!";
	this.errLogin_Expired = "The user period has expired! ";
	this.errLogin_Verify = "Verify code error!";
	//编辑输入部分
	this.errStringRequire = "Can't be empty";
	this.errNameRegex = "Must't be more than 32 characters";
	this.errIDNORegex = "Must be numbers or letters between 1-32 characters";
	this.errAccountRegex = "Must be numbers or letters between 4-32 characters";
	this.errSelectedRequired = "Did not choose to record information!";
	this.errEmailFormat = "Format invalid";
	this.errUrlFormat = "Format invalid";
	//系统部分
	this.errSendRequired = "Send request failed!";	
	this.errUnkown = "Unkown! ";
	this.errException = "System is abnormal!";			//RET_EXCEPTION_ERROR	1
	this.errSessionUnvalid = "Session has expired!";		//RET_SESSION_UNVALID	2
	this.errTimeout = "Request is timeout!";			//RET_REQUIRE_TIMEOUT	3
	this.errExceptionRequire = "Request abnormal!";		//RET_EXCEPTION_REQUIRE	4
	this.errExceptionNetwork = "Network abnormal!";		//RET_EXCEPTION_NETWORK	5
	this.errQueryTimeFormat = "Query time format is not correct!";	//RET_TIME_FROMAT_ERR	6
	this.errQueryTimeRange = "Begin time shall not be greater than end time!";	//RET_TIME_RANGE_ERR	7
	this.errRequireParam = "Request parameters are not correct!";			//RET_REQUIRE_PARAM  8
	this.errServerNoExist = "Server information does not exist!";		//RET_SERVER_NO_EXIST  9
	this.errServerTypeErr = "The server type is not correct!";		//RET_SERVER_TYPE_ERR = 10;	//服务器类型信息不正确
	this.errIDNOExist = "IDNO. has been used!";	//RET_SERVER_IDNO_EXIST = 11;	//服务器编号已经被使用
	this.errDeviceNoExist = "Device information does not exist!";	//RET_DEVICE_NO_EXIST = 12;	//设备信息不存在
	this.errDeviceLimitErr = "Shall't exceed the number of the system can manage!";	//RET_DEVICE_LIMIT_ERR = 13;
	this.errDeviceBatchIdnoErr = "Latter three of IDNO. must be number, and increments to maintain effective!";	//RET_DEVICE_BATCH_IDNO_ERR = 14;
	this.errAccountExist = "Account has been used!";		//	RET_ACCOUNT_EXIST = 15; 账号已经被使用
	this.errClientNoExist = "Client does not exist!";	//RET_CLIENT_NO_EXIST = 16; 客户信息不存在
	this.errClientHasDevice = "Client include devices! Can't be deleted!";	//RET_CLIENT_HAS_DEVICE = 17;	//客户还有设备信息！无法删除！
	this.errClientHasUser = "Client include users! Can't be deleted!";	//RET_CLIENT_HAS_USER = 18;	//客户还有子用户信息！无法删除！
	this.errOldPwd = "Old Password is incorrect!";	//RET_OLD_PWD_ERROR = 19;	//旧密码有误！
	this.errUserNoExist = "The user information does not exist!";	//RET_USER_NO_EXIST = 20;	//用户信息不存在
	this.errRoleNoExist = "The role information does not exist";	//RET_ROLE_NO_EXIST = 21;	//角色信息不存在
	this.errRoleNameExist = "Role name has been used!";	//RET_ROLE_NAME_EXIST = 22;	//角色名称已经被使用
	this.errRoleHasUsed = "Also use the information on this role! Can not be deleted!";	//RET_ROLE_HAS_USER = 23;	//还有用户使用此角色信息！无法删除！
	this.errNoPrivilige = "User do not have permission!";	//RET_NO_PRIVILIGE = 24;	//用户无权限
	this.errVehicelNoExist = "Device does not exist!";	//RET_VEHICLE_NO_EXIST = 25;	//车辆信息不存在
	this.errGroupNoExist = "Group does not exist!";	//RET_GROUP_NO_EXIST = 26;	//车辆分组不存在
	this.errGroupHasUsed = "Group is still occupied (also sub-grouping or subordinate vehicles)";	//RET_GROUP_HAS_USED = 27;	//车辆分组信息还在被占用（还存储子分组或者下级车辆）
	this.errDbConnErr = "The database connection exception occurred!";	//RET_DB_CONN_ERR = 28;	//数据库连接出现异常
	this.errNameExist = "Name has been used!";	//RET_NAME_EXIST = 29;	//名称已经被使用
	this.errNoExist = "Information does not exist!";	//RET_NO_EXIST = 30;		//信息不存在
	this.errDownStationSsidExist = "The download site SSID has been used!";//RET_DOWN_STATION_SSID_EXIST = 31;		//下载站点SSID已经被使用
	this.errDownStationUsed = "The download site is still occupied (with download server information)";//RET_DOWN_STATION_USED = 32;	//下载站点还被使用（拥有下载服务器信息）
	this.errDownStationNoExist = "The download site information does not exist!";//RET_DOWN_STATION_NO_EXIST = 33;	//下载站点信息不存在
	this.errGroupNameUsed = "Group name is exist in the same packet!";//RET_GROUP_NAME_USED = 34;	//同一分组下不允许存在相同名称的分组信息
	this.errDeviceHasRegister = "The device has register!";//RET_DEVICE_HAS_REGISTER = 35;	//设备信息已经登记到系统中	
	this.errServerNoSupport = "The server does not support this feature!";	//RET_SERVER_NO_SUPPORT = 36;	//服务器不支持此功能
	this.errImageSize = "Image size can not exceed 1M!";	//RET_IMAGE_SIZE_ERR = 41;	//图片大小超过1M
	this.errSImageType = "Image format error!";	//RET_IMAGE_TYPE_ERR = 42;	//图片格式错误
	
	this.errorConnection = "Connection Error";
	this.pagestatInfo = "Displaying {from} to {to} total of {total} items";
	this.of = "of";
	this.find = "Find";
	this.nomsg = "No items";
	this.procmsg ="Processing, please wait ...";
	this.pernumber = "Per Data";
	this.pagefrom = "The";
	this.pagetotal = "Total";
	
	this.system_show_rule = "Display Condition:";
	this.system_seq_date_asc = "Add Date ASC";
	this.system_seq_date_desc = "Add Date DESC";
}



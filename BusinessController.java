package com.pupil.central.controller;

import com.pupil.central.aop.Auth;
import com.pupil.central.enums.ResCode;
import com.pupil.central.enums.UserTypeEnum;
import com.pupil.central.exception.ShowToClientException;
import com.pupil.central.model.po.ShowInfo;
import com.pupil.central.model.po.ShowOrderInfo;
import com.pupil.central.model.po.UserAuth;
import com.pupil.central.model.po.UserInfo;
import com.pupil.central.model.vo.*;
import com.pupil.central.rpc.model.req.*;
import com.pupil.central.service.BusinessService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

/**
 * Created by wxn
 * 2018/4/2 16:14
 */

@Controller
public class BusinessController {

	@Autowired
	private BusinessService businessService;

	@RequestMapping("/")
	public String index(){
		return "index";
	}

	/**
	 * 商家登录
	 */
	@ResponseBody
	@RequestMapping(value = "/business/login" , method = RequestMethod.POST)
	public OnResponse<EmptyContent> businessLogin(@RequestBody BusinessLoginRequest req, HttpSession session){
		if (session.getAttribute("user")!=null){
			throw new ShowToClientException(ResCode.USER_ALREADY_LOGIN.code,ResCode.USER_ALREADY_LOGIN.msg);
		}
		UserInfo userInfo = businessService.businessLogin(req);
		session.setAttribute("user",userInfo);
		return OnResponse.SuccessResponse(ResCode.COMMON_SUCCESS.msg,new EmptyContent());
	}

	/**
	 * 新增商家
	 */
	@ResponseBody
	@RequestMapping(value = "/business/register",method = RequestMethod.POST)
	public OnResponse<EmptyContent> insertBusiness(@RequestBody InsertBusinessRequest request ,HttpSession session){
		UserInfo userInfo = (UserInfo) session.getAttribute("user");
//		if (userInfo==null){
//			throw new ShowToClientException(ResCode.USER_NOT_LOGIN.code,ResCode.USER_NOT_LOGIN.msg);
//		}

		businessService.insertBusiness(request);
		return OnResponse.SuccessResponse(ResCode.COMMON_SUCCESS.msg,new EmptyContent());
	}

	/**
	 * 商家后台账户管理
	 */
	@Auth({UserTypeEnum.CLIENT})
	@ResponseBody
	@RequestMapping(value = "/business/password/modify" ,method = RequestMethod.POST)
	public OnResponse<EmptyContent>modifyPwd(@RequestBody ModifyPasswordRequest request ,HttpSession session){
		if (session.getAttribute("user")==null){
			throw new ShowToClientException(ResCode.USER_NOT_LOGIN.msg);
		}
		businessService.modifyPassword(request);
		return OnResponse.SuccessResponse(ResCode.COMMON_SUCCESS.msg,new EmptyContent());
	}

	/**
	 * 商家认证
	 */
	@Auth({UserTypeEnum.CLIENT})
	@ResponseBody
	@RequestMapping(value = "/business/auth" , method = RequestMethod.POST)
	public OnResponse<EmptyContent>businessAuth(@RequestBody BusinessAuthRequest request ,HttpSession session){
		if (session.getAttribute("user")==null){
			throw new ShowToClientException(ResCode.USER_NOT_LOGIN.msg);
		}
		businessService.businessAuth(request);
		return OnResponse.SuccessResponse(ResCode.COMMON_SUCCESS.msg,new EmptyContent());
	}

	/**
	 * 查询商家认证信息
	 */
	@Auth({UserTypeEnum.CLIENT})
	@ResponseBody
	@RequestMapping(value = "/business/auth/query" ,method = RequestMethod.POST)
	public OnResponse<UserAuth>queryAuthInfo(@RequestBody QueryAuthInfoRequest request , HttpSession session){
		if (session.getAttribute("user")==null){
			throw new ShowToClientException(ResCode.USER_NOT_LOGIN.msg);
		}
		return OnResponse.SuccessResponse(ResCode.COMMON_SUCCESS.msg,businessService.queryAuthInfo(request));
	}

	/**
	 * 查询商家全部订单
	 */
	@Auth({UserTypeEnum.CLIENT})
	@ResponseBody
	@RequestMapping(value = "/business/order/queryList" ,method = RequestMethod.POST)
	public OnResponse<PageContent<ShowOrderInfo>>queryOrderList(@RequestBody SelectAllOrderRequest request , HttpSession session){
		if (session.getAttribute("user")==null){
			throw new ShowToClientException(ResCode.USER_NOT_LOGIN.msg);
		}
		return OnResponse.SuccessResponse(ResCode.COMMON_SUCCESS.msg,businessService.selectAllOrder(request));
	}

	/**
	 * 查询全部show
	 */
	@Auth({UserTypeEnum.CLIENT})
	@ResponseBody
	@RequestMapping(value = "/business/show/queryList" ,method = RequestMethod.GET)
	public OnResponse<PageContent<ShowInfo>>queryOrderList(PageRequest request , HttpSession session){
		if (session.getAttribute("user")==null){
			throw new ShowToClientException(ResCode.USER_NOT_LOGIN.msg);
		}
		request.setUserId(((UserInfo)session.getAttribute("user")).getUserId());
		return OnResponse.SuccessResponse(ResCode.COMMON_SUCCESS.msg,businessService.selectAllShow(request));
	}
}

package com.blossom.backend.base.user;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blossom.backend.base.user.pojo.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 用户
 *
 * @author xzzz
 */
@Mapper
public interface UserMapper extends BaseMapper<UserEntity> {

    /**
     * 修改用户信息
     */
    void updById(UserEntity user);

    /**
     * 修改密码
     *
     * @param userId   用户ID
     * @param password 新密码
     */
    void updPwd(@Param("userId") Long userId, @Param("password") String password);
}

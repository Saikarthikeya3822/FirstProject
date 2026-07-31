package com.Karthikeya.ecommerce.User_activity_Repo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Karthikeya.ecommerce.User_activity_Model.ActivityType;
import com.Karthikeya.ecommerce.User_activity_Model.UserActivity;
import com.Karthikeya.ecommerce.User_activity_dto.ProductCountDTO;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {

	long countByActivityType(ActivityType activityType);

	@Query("""
			SELECT COUNT(ua)
			FROM UserActivity ua
			WHERE ua.userId = :userId
			AND ua.activityType = :activityType
			AND ua.createdAt >= :fromDate
			""")
	Long countActivities(@Param("userId") String userId, @Param("activityType") ActivityType activityType,
			@Param("fromDate") LocalDateTime fromDate);

	@Query("""
			SELECT new com.Karthikeya.ecommerce.User_activity_dto.ProductCountDTO(
			u.productId,
			COUNT(u)
			)
			FROM UserActivity u
			WHERE u.activityType='VIEW_PRODUCT'
			GROUP BY u.productId
			ORDER BY COUNT(u) DESC
			""")
	List<ProductCountDTO> getTopViewedProducts();

	@Query("""
			SELECT new com.Karthikeya.ecommerce.User_activity_dto.ProductCountDTO(
			u.productId,
			COUNT(u)
			)
			FROM UserActivity u
			WHERE u.activityType='ADD_TO_CART'
			GROUP BY u.productId
			ORDER BY COUNT(u) DESC
			""")
	List<ProductCountDTO> getTopCartProducts();

	@Query("""
			SELECT new com.Karthikeya.ecommerce.User_activity_dto.ProductCountDTO(
			u.productId,
			COUNT(u)
			)
			FROM UserActivity u
			WHERE u.activityType='PURCHASE_PRODUCT'
			GROUP BY u.productId
			ORDER BY COUNT(u) DESC
			""")
	List<ProductCountDTO> getTopPurchasedProducts();

	/* Analytics by user */

	Long countByUserIdAndActivityType(String userId, ActivityType activityType);

	@Query("""
			SELECT new com.Karthikeya.ecommerce.User_activity_dto.ProductCountDTO(
			       u.productId,
			       COUNT(u)
			)
			FROM UserActivity u
			WHERE u.userId = :userId
			AND u.activityType = 'VIEW_PRODUCT'
			GROUP BY u.productId
			ORDER BY COUNT(u) DESC
			""")
	List<ProductCountDTO> getMostViewedProductsByUser(@Param("userId") String userId);

	@Query("""
			SELECT new com.Karthikeya.ecommerce.User_activity_dto.ProductCountDTO(
			       u.productId,
			       COUNT(u)
			)
			FROM UserActivity u
			WHERE u.userId = :userId
			AND u.activityType = 'ADD_TO_CART'
			GROUP BY u.productId
			ORDER BY COUNT(u) DESC
			""")
	List<ProductCountDTO> getMostCartProductsByUser(@Param("userId") String userId);

	@Query("""
			SELECT new com.Karthikeya.ecommerce.User_activity_dto.ProductCountDTO(
			       u.productId,
			       COUNT(u)
			)
			FROM UserActivity u
			WHERE u.userId = :userId
			AND u.activityType = 'PURCHASE_PRODUCT'
			GROUP BY u.productId
			ORDER BY COUNT(u) DESC
			""")

	List<ProductCountDTO> getMostPurchasedProductsByUser(@Param("userId") String userId);

	List<UserActivity> findTop10ByUserIdAndActivityTypeOrderByCreatedAtDesc(String userId, ActivityType activityType);

	List<UserActivity> findTop20ByUserIdOrderByCreatedAtDesc(String userId);

	@Query("""
			SELECT COUNT(ua)
			FROM UserActivity ua
			WHERE ua.userId = :userId
			AND ua.activityType = :activityType
			AND ua.createdAt >= :fromDate
			""")
	Long countActivities(@Param("userId") String userId, @Param("activityType") String activityType,
			@Param("fromDate") LocalDateTime fromDate);

	@Query("""
			SELECT ua.productCategory,
			       COUNT(ua)
			FROM UserActivity ua
			WHERE ua.userId = :userId
			AND ua.createdAt >= :fromDate
			GROUP BY ua.productCategory
			ORDER BY COUNT(ua) DESC
			""")
	List<Object[]> getCategoryBreakdown(@Param("userId") String userId, @Param("fromDate") LocalDateTime fromDate);

	@Query("""
			SELECT ua.productCategory,
			       COUNT(ua)
			FROM UserActivity ua
			WHERE ua.userId = :userId
			AND ua.activityType='PURCHASE_PRODUCT'
			AND ua.createdAt >= :fromDate
			GROUP BY ua.productCategory
			ORDER BY COUNT(ua) DESC
			""")
	List<Object[]> getMostPurchasedCategory(@Param("userId") String userId, @Param("fromDate") LocalDateTime fromDate);

	List<UserActivity> findTop20ByUserIdAndCreatedAtAfterOrderByCreatedAtDesc(String userId, LocalDateTime fromDate);

	List<UserActivity> findTop10ByUserIdAndActivityTypeAndCreatedAtAfterOrderByCreatedAtDesc(String userId,
			ActivityType activityType, LocalDateTime fromDate);

}

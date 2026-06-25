class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hm = {}

        for i in range(len(nums)):
            sub = target - nums[i]
            if sub in hm:
                return [hm.get(sub),i]
            else:
                hm[nums[i]] = i
        
        

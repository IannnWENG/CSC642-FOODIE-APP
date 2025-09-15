// Menu improvement functionality test
// Test the new real menu search service

import realMenuService from '../services/realMenuService';

// Test restaurant information
const testRestaurantInfo = {
  name: "Din Tai Fung",
  place_id: "test_place_id",
  restaurantType: "chinese",
  rating: 4.5,
  price_level: 3,
  user_ratings_total: 1250,
  business_status: "OPERATIONAL",
  vicinity: "Xinyi District, Taipei",
  formatted_address: "No. 7, Section 5, Xinyi Road, Xinyi District, Taipei",
  website: "https://www.dintaifung.com.tw",
  formatted_phone_number: "+886-2-2345-6789",
  types: ["restaurant", "food", "establishment"],
  reviews: [
    {
      text: "Xiaolongbao is delicious and service is great",
      rating: 5
    },
    {
      text: "Recommend red oil wontons and hot and sour soup",
      rating: 4
    }
  ],
  photos: []
};

// Test function
async function testMenuImprovement() {
  console.log('🧪 Starting menu improvement functionality test...');
  
  try {
    // Test 1: Basic menu search
    console.log('\n📋 Test 1: Basic menu search');
    const menu = await realMenuService.getRestaurantMenu(
      testRestaurantInfo.place_id, 
      testRestaurantInfo
    );
    
    console.log('Menu search result:', {
      hasMenu: !menu.noMenuAvailable,
      source: menu.source,
      categories: menu.categories?.length || 0,
      totalItems: menu.categories?.reduce((total, cat) => total + cat.items.length, 0) || 0,
      aiSearchAvailable: menu.aiSearchAvailable
    });
    
    // Test 2: AI search query building
    console.log('\n🤖 Test 2: AI search query building');
    const searchQuery = realMenuService.buildAISearchQuery(testRestaurantInfo);
    console.log('AI search query:', searchQuery);
    
    // Test 3: Keyword extraction
    console.log('\n🔍 Test 3: Keyword extraction');
    const keywords = realMenuService.extractKeywordsFromReviews(testRestaurantInfo.reviews);
    console.log('Extracted keywords:', keywords);
    
    // Test 4: Menu type template
    console.log('\n🍽️ Test 4: Menu type template');
    const chineseMenu = realMenuService.getBaseMenuForType('chinese');
    console.log('Chinese menu template:', {
      categories: chineseMenu.categories.length,
      items: chineseMenu.categories.reduce((total, cat) => total + cat.items.length, 0)
    });
    
    // Test 5: Cache functionality
    console.log('\n💾 Test 5: Cache functionality');
    realMenuService.cacheMenu('test_cache', menu);
    const cachedMenu = realMenuService.getCachedMenu('test_cache');
    console.log('Cache test:', cachedMenu ? 'Success' : 'Failed');
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export test function
export { testMenuImprovement };

// If running this file directly, execute test
if (typeof window !== 'undefined') {
  // Run test in browser environment
  window.testMenuImprovement = testMenuImprovement;
  console.log('Menu improvement test loaded, please run in console: testMenuImprovement()');
}

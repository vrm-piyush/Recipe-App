import unittest
from main import create_app
from config import TestConfig
from exts import db

class TestAPI(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.client = self.app.test_client(self)

        with self.app.app_context():
            # db.init_app(self.app)
			
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
            db.engine.dispose()  # Explicitly close database connections

    def test_hello_world(self):
        hello_response = self.client.get('/recipe/hello')
		
        json = hello_response.json
					 
		
        self.assertEqual(json, {"message": "Hello World"})

    def test_signup(self):
        signup_response = self.client.post('/auth/signup',
            json={"username": "testuser",
                  "email": "testuser@test.com",
                  "password": "password"}
        )
												 
        self.assertEqual(signup_response.status_code, 201)

    def test_login(self):
        signup_response = self.client.post('/auth/signup',
            json={"username": "testuser",
                  "email": "testuser@test.com",
                  "password": "password"})
        
        login_response = self.client.post('/auth/login',
            json={"username": "testuser",
                  "password": "password"})
        
        self.assertEqual(login_response.status_code, 200)

    def test_get_all_recipes(self):
									  
        response = self.client.get('/recipe/recipes')
						 
        self.assertEqual(response.status_code, 200)

    def test_get_one_recipe(self):
        id = 1 
        response = self.client.get(f'/recipe/recipe/{id}')
					  
        self.assertEqual(response.status_code, 404)

    def test_create_recipe(self):
        signup_response = self.client.post('/auth/signup',
            json={"username": "testuser",
                  "email": "testuser@test.com",
                  "password": "password"})
        
        login_response = self.client.post('/auth/login',
            json={"username": "testuser",
                  "password": "password"})
        
        access_token = login_response.json['access_token']
        
        create_recipe_response = self.client.post('/recipe/recipes',
            json={"title": "test recipe",
                  "description": "test description"},
            headers={"Authorization": f"Bearer {access_token}"}
        )   
        
        self.assertEqual(create_recipe_response.status_code, 201)

    def test_update_recipe(self):
        signup_response = self.client.post('/auth/signup',
            json={"username": "testuser",
                  "email": "testuser@test.com",
                  "password": "password"})
        
        login_response = self.client.post('/auth/login',
            json={"username": "testuser",
                  "password": "password"})
        
        access_token = login_response.json['access_token']
        
        create_recipe_response = self.client.post('/recipe/recipes',
            json={"title": "test recipe",
                  "description": "test description"},
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        id = 1
        update_recipe_response = self.client.put(f'/recipe/recipe/{id}',
            json={"title": "test recipe updated",
                  "description": "test description updated"},
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        self.assertEqual(update_recipe_response.status_code, 200)

    def test_delete_recipe(self):
        signup_response = self.client.post('/auth/signup',
            json={"username": "testuser",
                  "email": "testuser@test.com",
                  "password": "password"})
        
        login_response = self.client.post('/auth/login',
            json={"username": "testuser",
                  "password": "password"})
        
        access_token = login_response.json['access_token']
        
        create_recipe_response = self.client.post('/recipe/recipes',
            json={"title": "test recipe",
                  "description": "test description"},
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        id = 1
        delete_recipe_response = self.client.delete(f'/recipe/recipe/{id}',
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        print(delete_recipe_response.json)
        self.assertEqual(delete_recipe_response.status_code, 200)

	
if __name__ == '__main__':
    unittest.main()

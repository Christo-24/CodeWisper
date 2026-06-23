from django.db import models

class LatestCapture(models.Model):
	problem = models.TextField(blank=True, default="")
	code = models.TextField(blank=True, default="")
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-updated_at"]

	def __str__(self):
		return f"LatestCapture(updated_at={self.updated_at})"

class Conversation(models.Model):
	question = models.TextField()
	answer = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.question[:50]